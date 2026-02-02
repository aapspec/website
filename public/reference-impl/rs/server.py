"""
AAP Resource Server - Example HTTP Server

Example Resource Server that validates AAP tokens and enforces constraints.
"""

import os
from flask import Flask, request, jsonify
from typing import Dict, Any

from .validator import TokenValidator, ValidationError
from .capability_matcher import CapabilityMatcher
from .constraint_enforcer import ConstraintEnforcer, ConstraintViolationError


app = Flask(__name__)

# Configuration
RS_AUDIENCE = os.getenv("AAP_RS_AUDIENCE", "https://api.example.com")
TRUSTED_ISSUERS = os.getenv("AAP_TRUSTED_ISSUERS", "https://as.example.com").split(",")
PUBLIC_KEY_PATH = os.getenv("AAP_PUBLIC_KEY_PATH", "../keys/as_public_key.pem")

# Load AS public key
if not os.path.exists(PUBLIC_KEY_PATH):
    raise FileNotFoundError(
        f"Public key not found at {PUBLIC_KEY_PATH}. "
        "Obtain public key from Authorization Server."
    )

with open(PUBLIC_KEY_PATH, "rb") as f:
    public_key = f.read()

# Initialize components
validator = TokenValidator(
    public_key=public_key,
    audience=RS_AUDIENCE,
    trusted_issuers=TRUSTED_ISSUERS,
)
capability_matcher = CapabilityMatcher()
constraint_enforcer = ConstraintEnforcer()


def extract_bearer_token() -> str:
    """Extract bearer token from Authorization header"""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise ValidationError(
            "invalid_token",
            "Missing or invalid Authorization header",
            http_status=401,
        )
    return auth_header[7:]  # Remove "Bearer " prefix


def authorize_request(action: str, target_url: str = None) -> Dict[str, Any]:
    """
    Authorize a request using AAP token

    Args:
        action: Requested action (e.g., "search.web")
        target_url: Target URL for domain validation

    Returns:
        Token payload if authorized

    Raises:
        ValidationError or ConstraintViolationError if not authorized
    """
    # Extract token
    token = extract_bearer_token()

    # Build request context
    request_context = {
        "action": action,
        "method": request.method,
        "content_length": request.content_length or 0,
    }
    if target_url:
        request_context["target_url"] = target_url

    # Validate token (Section 7.1-7.4, 7.7)
    payload = validator.validate(token, request_context)

    # Find matching capability (Section 7.5)
    capabilities = payload.get("capabilities", [])
    matching_capability = capability_matcher.find_matching_capability(
        capabilities, action
    )

    if not matching_capability:
        raise ValidationError(
            "aap_invalid_capability",
            "No matching capability for requested action",
        )

    # Enforce constraints (Section 7.5)
    constraints = matching_capability.get("constraints", {})
    token_jti = payload.get("jti")
    constraint_enforcer.enforce_constraints(constraints, request_context, token_jti)

    # Check oversight requirements (Section 7.6)
    oversight = payload.get("oversight", {})
    requires_approval = oversight.get("requires_human_approval_for", [])
    if action in requires_approval:
        approval_ref = oversight.get("approval_reference", "")
        raise ValidationError(
            "aap_approval_required",
            f"This action requires human approval. Reference: {approval_ref}",
        )

    return payload


@app.route("/")
def index():
    """Resource Server information"""
    return jsonify(
        {
            "service": "AAP Resource Server",
            "version": "0.1.0",
            "audience": RS_AUDIENCE,
            "trusted_issuers": TRUSTED_ISSUERS,
        }
    )


@app.route("/api/search", methods=["GET"])
def search():
    """Example protected endpoint: web search"""
    try:
        # Extract parameters
        query = request.args.get("q")
        target_url = request.args.get("url", "https://example.org")

        # Authorize request
        payload = authorize_request(action="search.web", target_url=target_url)

        # If authorized, perform action
        return jsonify(
            {
                "status": "success",
                "message": "Search authorized",
                "query": query,
                "target_url": target_url,
                "agent": payload["agent"]["id"],
                "task": payload["task"]["id"],
            }
        )

    except ValidationError as e:
        return (
            jsonify(
                {
                    "error": e.error_code,
                    "error_description": e.description,
                }
            ),
            e.http_status,
        )
    except ConstraintViolationError as e:
        return (
            jsonify(
                {
                    "error": "aap_constraint_violation",
                    "error_description": "Request violates capability constraints",
                }
            ),
            e.http_status,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "server_error",
                    "error_description": "An internal error occurred",
                }
            ),
            500,
        )


@app.route("/api/cms/draft", methods=["POST"])
def create_draft():
    """Example protected endpoint: create CMS draft"""
    try:
        # Authorize request
        payload = authorize_request(action="cms.create_draft")

        # If authorized, perform action
        content = request.get_json()
        return jsonify(
            {
                "status": "success",
                "message": "Draft created",
                "draft_id": "draft-12345",
                "agent": payload["agent"]["id"],
                "task": payload["task"]["id"],
            }
        )

    except ValidationError as e:
        return (
            jsonify(
                {
                    "error": e.error_code,
                    "error_description": e.description,
                }
            ),
            e.http_status,
        )
    except ConstraintViolationError as e:
        return (
            jsonify(
                {
                    "error": "aap_constraint_violation",
                    "error_description": "Request violates capability constraints",
                }
            ),
            e.http_status,
        )


@app.route("/api/cms/publish", methods=["POST"])
def publish():
    """Example protected endpoint: publish content (requires approval)"""
    try:
        # Authorize request
        payload = authorize_request(action="cms.publish")

        # This should never be reached if oversight is configured correctly
        # (ValidationError with aap_approval_required will be raised)
        return jsonify(
            {
                "status": "success",
                "message": "Content published",
            }
        )

    except ValidationError as e:
        if e.error_code == "aap_approval_required":
            # Return 403 with approval reference
            return (
                jsonify(
                    {
                        "error": e.error_code,
                        "error_description": e.description,
                    }
                ),
                403,
            )
        return (
            jsonify(
                {
                    "error": e.error_code,
                    "error_description": e.description,
                }
            ),
            e.http_status,
        )


def run_server():
    """Run the Resource Server"""
    port = int(os.getenv("AAP_RS_PORT", "8081"))
    host = os.getenv("AAP_RS_HOST", "0.0.0.0")

    print(f"Starting AAP Resource Server")
    print(f"Audience: {RS_AUDIENCE}")
    print(f"Trusted Issuers: {TRUSTED_ISSUERS}")
    print(f"Listening on {host}:{port}")
    app.run(host=host, port=port, debug=True)


if __name__ == "__main__":
    run_server()
