"""
Token Issuer for AAP Authorization Server

Issues AAP-compliant JWT tokens with agent, task, and capability claims.
"""

import jwt
import uuid
import time
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta

from .policy_engine import PolicyEngine, Capability
from .config import config


class TokenIssuer:
    """Issues AAP tokens"""

    def __init__(self, policy_engine: PolicyEngine, private_key: bytes, algorithm: str = "ES256"):
        """
        Initialize token issuer

        Args:
            policy_engine: PolicyEngine instance
            private_key: Private key for signing tokens (PEM format)
            algorithm: Signing algorithm (ES256 or RS256)
        """
        self.policy_engine = policy_engine
        self.private_key = private_key
        self.algorithm = algorithm
        self.issuer = config.issuer

    def issue_token(
        self,
        agent_id: str,
        agent_type: str,
        operator: str,
        task_id: str,
        task_purpose: str,
        requested_capabilities: List[str],
        audience: str,
        agent_metadata: Optional[Dict[str, Any]] = None,
        task_metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Issue an AAP access token

        Args:
            agent_id: Unique agent identifier
            agent_type: Type of agent (e.g., "llm-autonomous")
            operator: Operator organization identifier
            task_id: Unique task identifier
            task_purpose: Human-readable task purpose
            requested_capabilities: List of requested action names
            audience: Intended audience (Resource Server)
            agent_metadata: Optional additional agent metadata
            task_metadata: Optional additional task metadata

        Returns:
            Signed JWT token as string
        """
        # Get operator policy
        policy = self.policy_engine.get_policy(operator)
        if not policy:
            raise ValueError(f"No policy found for operator: {operator}")

        # Evaluate capabilities
        capabilities = self.policy_engine.evaluate_capabilities(
            operator, requested_capabilities, task_purpose
        )

        if not capabilities:
            raise ValueError(
                f"No capabilities granted for requested actions: {requested_capabilities}"
            )

        # Build token payload
        now = int(time.time())
        exp = now + policy.token_lifetime
        jti = str(uuid.uuid4())

        payload = {
            # Standard JWT claims
            "iss": self.issuer,
            "sub": agent_id,
            "aud": audience,
            "exp": exp,
            "iat": now,
            "jti": jti,
            # AAP claims
            "agent": self._build_agent_claim(
                agent_id, agent_type, operator, agent_metadata
            ),
            "task": self._build_task_claim(
                task_id, task_purpose, task_metadata, now
            ),
            "capabilities": [cap.to_dict() for cap in capabilities],
            "delegation": {
                "depth": 0,
                "max_depth": policy.max_delegation_depth,
                "chain": [agent_id],
            },
        }

        # Add optional claims
        if policy.oversight:
            payload["oversight"] = policy.oversight

        if policy.audit:
            payload["audit"] = self._build_audit_claim(policy.audit, task_id)

        # Sign token
        token = jwt.encode(
            payload, self.private_key, algorithm=self.algorithm, headers={"kid": config.key_id}
        )

        return token

    def _build_agent_claim(
        self,
        agent_id: str,
        agent_type: str,
        operator: str,
        metadata: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Build agent claim"""
        claim = {
            "id": agent_id,
            "type": agent_type,
            "operator": operator,
        }

        if metadata:
            # Add optional fields from metadata
            if "name" in metadata:
                claim["name"] = metadata["name"]
            if "version" in metadata:
                claim["version"] = metadata["version"]
            if "model" in metadata:
                claim["model"] = metadata["model"]
            if "runtime" in metadata:
                claim["runtime"] = metadata["runtime"]

        return claim

    def _build_task_claim(
        self,
        task_id: str,
        task_purpose: str,
        metadata: Optional[Dict[str, Any]],
        created_at: int,
    ) -> Dict[str, Any]:
        """Build task claim"""
        claim = {
            "id": task_id,
            "purpose": task_purpose,
            "created_at": created_at,
        }

        if metadata:
            # Add optional fields from metadata
            if "created_by" in metadata:
                claim["created_by"] = metadata["created_by"]
            if "priority" in metadata:
                claim["priority"] = metadata["priority"]
            if "category" in metadata:
                claim["category"] = metadata["category"]
            if "expires_at" in metadata:
                claim["expires_at"] = metadata["expires_at"]

        return claim

    def _build_audit_claim(
        self, audit_config: Dict[str, Any], task_id: str
    ) -> Dict[str, Any]:
        """Build audit claim"""
        claim = {
            "trace_id": str(uuid.uuid4()),  # Generate unique trace ID per token
            "log_level": audit_config.get("log_level", "standard"),
        }

        if "retention_period_days" in audit_config:
            claim["retention_period"] = audit_config["retention_period_days"]

        if "compliance_framework" in audit_config:
            claim["compliance_framework"] = audit_config["compliance_framework"]

        return claim

    def exchange_token(
        self,
        parent_token: str,
        new_audience: str,
        public_key: bytes,
        requested_capabilities: Optional[List[str]] = None,
    ) -> str:
        """
        Exchange a token for a derived token (OAuth 2.0 Token Exchange)

        Args:
            parent_token: Original AAP token
            new_audience: New audience for derived token
            public_key: Public key for verifying parent token
            requested_capabilities: Optional subset of capabilities to request

        Returns:
            Derived AAP token as string
        """
        # Validate parent token
        try:
            parent_payload = jwt.decode(
                parent_token,
                public_key,
                algorithms=[self.algorithm, "RS256"],  # Support both ES256 and RS256
                audience=jwt.api_jwt.get_unverified_claims(parent_token).get("aud"),
                options={"verify_exp": True},
            )
        except jwt.InvalidTokenError as e:
            raise ValueError(f"Invalid parent token: {e}")

        # Extract parent claims
        agent = parent_payload["agent"]
        task = parent_payload["task"]
        parent_capabilities = parent_payload["capabilities"]
        parent_delegation = parent_payload.get("delegation", {})
        parent_jti = parent_payload["jti"]

        # Validate delegation depth
        current_depth = parent_delegation.get("depth", 0)
        max_depth = parent_delegation.get("max_depth", 2)

        if current_depth >= max_depth:
            raise ValueError(
                f"Cannot delegate: depth {current_depth} >= max_depth {max_depth}"
            )

        # Determine capabilities for derived token (privilege reduction)
        if requested_capabilities:
            # Filter to requested subset
            parent_actions = {cap["action"] for cap in parent_capabilities}
            requested_set = set(requested_capabilities)

            # Ensure requested capabilities are subset of parent
            if not requested_set.issubset(parent_actions):
                unauthorized = requested_set - parent_actions
                raise ValueError(
                    f"Requested capabilities not in parent token: {unauthorized}"
                )

            # Keep only requested capabilities
            derived_capabilities = [
                cap for cap in parent_capabilities if cap["action"] in requested_set
            ]
        else:
            # Keep all parent capabilities (still apply reduction)
            derived_capabilities = parent_capabilities.copy()

        # Convert to Capability objects for reduction
        capability_objects = [
            Capability(
                action=cap["action"],
                constraints=cap.get("constraints", {}),
                description=cap.get("description"),
                resources=cap.get("resources"),
            )
            for cap in derived_capabilities
        ]

        # Apply privilege reduction
        new_depth = current_depth + 1
        reduced_capabilities = self.policy_engine.reduce_capabilities_for_delegation(
            capability_objects, new_depth
        )

        # Calculate reduced lifetime (50% reduction per delegation level)
        parent_lifetime = parent_payload["exp"] - parent_payload["iat"]
        reduced_lifetime = int(parent_lifetime * config.delegated_token_lifetime_reduction)

        # Build derived token payload
        now = int(time.time())
        exp = now + reduced_lifetime
        jti = str(uuid.uuid4())

        # Update delegation chain
        parent_chain = parent_delegation.get("chain", [agent["id"]])
        new_chain = parent_chain + [new_audience]  # Append new tool/service to chain

        payload = {
            # Standard JWT claims
            "iss": self.issuer,
            "sub": agent["id"],  # Subject remains original agent
            "aud": new_audience,  # New audience
            "exp": exp,
            "iat": now,
            "jti": jti,
            # AAP claims (mostly copied from parent)
            "agent": agent,
            "task": task,
            "capabilities": [cap.to_dict() for cap in reduced_capabilities],
            "delegation": {
                "depth": new_depth,
                "max_depth": max_depth,
                "chain": new_chain,
                "parent_jti": parent_jti,
                "privilege_reduction": {
                    "capabilities_removed": list(
                        {cap["action"] for cap in parent_capabilities}
                        - {cap.action for cap in reduced_capabilities}
                    ),
                    "lifetime_reduced_by": parent_lifetime - reduced_lifetime,
                },
            },
        }

        # Copy optional claims if present
        if "oversight" in parent_payload:
            payload["oversight"] = parent_payload["oversight"]

        if "audit" in parent_payload:
            # Optionally regenerate trace_id for cross-domain delegation (privacy)
            audit = parent_payload["audit"].copy()
            if new_audience != parent_payload.get("aud"):
                # Different audience = different trust domain; regenerate trace_id
                audit["trace_id"] = str(uuid.uuid4())
                audit["trace_id_scope"] = "domain"
            payload["audit"] = audit

        # Sign derived token
        token = jwt.encode(
            payload, self.private_key, algorithm=self.algorithm, headers={"kid": config.key_id}
        )

        return token
