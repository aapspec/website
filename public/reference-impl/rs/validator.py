"""
Token Validator for AAP Resource Server

Validates AAP tokens according to specification Section 7 (Resource Server Validation Rules).
"""

import jwt
import time
from typing import Dict, Any, Optional
from datetime import datetime


class ValidationError(Exception):
    """Token validation failed"""

    def __init__(self, error_code: str, description: str, http_status: int = 403):
        self.error_code = error_code
        self.description = description
        self.http_status = http_status
        super().__init__(f"{error_code}: {description}")


class TokenValidator:
    """Validates AAP access tokens"""

    def __init__(
        self,
        public_key: bytes,
        audience: str,
        trusted_issuers: list,
        algorithms: Optional[list] = None,
        clock_skew_tolerance: int = 300,  # 5 minutes
    ):
        """
        Initialize token validator

        Args:
            public_key: AS public key for signature verification (PEM format)
            audience: Expected audience (this Resource Server's identifier)
            trusted_issuers: List of trusted Authorization Server issuers
            algorithms: Allowed signing algorithms (default: ES256, RS256)
            clock_skew_tolerance: Clock skew tolerance in seconds (default: 300)
        """
        self.public_key = public_key
        self.audience = audience
        self.trusted_issuers = trusted_issuers
        self.algorithms = algorithms or ["ES256", "RS256"]
        self.clock_skew_tolerance = clock_skew_tolerance

    def validate(self, token: str, request: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Validate AAP token and return payload

        Args:
            token: JWT token string
            request: Optional request context (action, target URL, etc.)

        Returns:
            Decoded token payload if valid

        Raises:
            ValidationError: If validation fails
        """
        # Step 1: Standard OAuth validation
        payload = self._validate_jwt(token)

        # Step 2: Proof-of-possession (if required)
        # TODO: Implement DPoP and mTLS validation
        # For reference implementation, PoP validation is not required

        # Step 3: Agent identity validation
        self._validate_agent_identity(payload)

        # Step 4: Task binding validation
        if request:
            self._validate_task_binding(payload, request)

        # Step 5: Delegation validation
        self._validate_delegation(payload)

        return payload

    def _validate_jwt(self, token: str) -> Dict[str, Any]:
        """
        Validate JWT signature, expiration, audience, and issuer

        Section 7.1: Standard Token Validation
        """
        try:
            payload = jwt.decode(
                token,
                self.public_key,
                algorithms=self.algorithms,
                audience=self.audience,
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_aud": True,
                    "require": ["iss", "sub", "aud", "exp", "iat", "agent", "task", "capabilities"],
                },
                leeway=self.clock_skew_tolerance,
            )
        except jwt.ExpiredSignatureError:
            raise ValidationError(
                "invalid_token",
                "Token has expired",
                http_status=401,
            )
        except jwt.InvalidAudienceError:
            raise ValidationError(
                "invalid_token",
                "Token audience does not match this resource server",
                http_status=401,
            )
        except jwt.InvalidSignatureError:
            raise ValidationError(
                "invalid_token",
                "Token signature verification failed",
                http_status=401,
            )
        except jwt.MissingRequiredClaimError as e:
            raise ValidationError(
                "invalid_token",
                f"Token missing required claim: {e}",
                http_status=401,
            )
        except jwt.InvalidTokenError as e:
            raise ValidationError(
                "invalid_token",
                f"Token validation failed: {e}",
                http_status=401,
            )

        # Verify issuer is trusted
        if payload.get("iss") not in self.trusted_issuers:
            raise ValidationError(
                "invalid_token",
                "Token issuer is not trusted",
                http_status=401,
            )

        return payload

    def _validate_agent_identity(self, payload: Dict[str, Any]):
        """
        Validate agent identity

        Section 7.3: Agent Identity Validation
        """
        agent = payload.get("agent")
        if not agent:
            raise ValidationError(
                "invalid_token",
                "Token missing agent claim",
                http_status=401,
            )

        # Validate required agent fields
        if not agent.get("id"):
            raise ValidationError(
                "invalid_token",
                "Agent claim missing required 'id' field",
                http_status=401,
            )

        if not agent.get("type"):
            raise ValidationError(
                "invalid_token",
                "Agent claim missing required 'type' field",
                http_status=401,
            )

        if not agent.get("operator"):
            raise ValidationError(
                "invalid_token",
                "Agent claim missing required 'operator' field",
                http_status=401,
            )

        # TODO: Check agent against allowlist/denylist
        # For reference implementation, all agents are accepted

    def _validate_task_binding(self, payload: Dict[str, Any], request: Dict[str, Any]):
        """
        Validate task binding consistency

        Section 7.4: Task Binding Validation
        """
        task = payload.get("task")
        if not task:
            raise ValidationError(
                "invalid_token",
                "Token missing task claim",
                http_status=401,
            )

        # Validate required task fields
        if not task.get("id"):
            raise ValidationError(
                "invalid_token",
                "Task claim missing required 'id' field",
                http_status=401,
            )

        if not task.get("purpose"):
            raise ValidationError(
                "invalid_token",
                "Task claim missing required 'purpose' field",
                http_status=401,
            )

        # TODO: Validate task consistency with request
        # For reference implementation, basic validation only
        # Production RS should implement heuristic or policy-based validation

    def _validate_delegation(self, payload: Dict[str, Any]):
        """
        Validate delegation chain

        Section 7.7: Delegation Chain Validation
        """
        delegation = payload.get("delegation")
        if not delegation:
            # No delegation; token is original (depth should be 0)
            return

        depth = delegation.get("depth")
        max_depth = delegation.get("max_depth")
        chain = delegation.get("chain", [])

        # Validate delegation depth
        if depth is None or max_depth is None:
            raise ValidationError(
                "aap_invalid_delegation_chain",
                "Delegation claim missing required depth or max_depth",
            )

        if depth > max_depth:
            raise ValidationError(
                "aap_excessive_delegation",
                "Delegation depth exceeds maximum allowed depth",
            )

        # Validate chain length matches depth
        if len(chain) != depth + 1:
            raise ValidationError(
                "aap_invalid_delegation_chain",
                f"Delegation chain length ({len(chain)}) does not match depth+1 ({depth+1})",
            )
