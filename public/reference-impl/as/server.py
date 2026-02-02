"""
AAP Authorization Server - HTTP Server

Provides OAuth 2.0 endpoints for token issuance and Token Exchange.
"""

import os
import json
from flask import Flask, request, jsonify
from typing import Dict, Any

from .config import config
from .policy_engine import PolicyEngine
from .token_issuer import TokenIssuer


app = Flask(__name__)

# Initialize components
policy_engine = PolicyEngine(config.policy_path)

# Load signing keys
private_key_path = config.private_key_path
public_key_path = config.public_key_path

if not os.path.exists(private_key_path):
    raise FileNotFoundError(
        f"Private key not found at {private_key_path}. "
        "Generate keys using: openssl ecparam -genkey -name prime256v1 -noout -out as_private_key.pem"
    )

with open(private_key_path, "rb") as f:
    private_key = f.read()

with open(public_key_path, "rb") as f:
    public_key = f.read()

token_issuer = TokenIssuer(policy_engine, private_key, config.signing_algorithm)


@app.route("/")
def index():
    """Server information endpoint"""
    return jsonify(
        {
            "service": "AAP Authorization Server",
            "version": "0.1.0",
            "issuer": config.issuer,
            "endpoints": {
                "token": "/token",
                "jwks": "/.well-known/jwks.json",
                "metadata": "/.well-known/oauth-authorization-server",
            },
        }
    )


@app.route("/.well-known/oauth-authorization-server")
def metadata():
    """OAuth 2.0 Authorization Server Metadata (RFC 8414)"""
    return jsonify(
        {
            "issuer": config.issuer,
            "token_endpoint": f"{config.issuer}/token",
            "jwks_uri": f"{config.issuer}/.well-known/jwks.json",
            "grant_types_supported": [
                "client_credentials",
                "urn:ietf:params:oauth:grant-type:token-exchange",
            ],
            "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
            "response_types_supported": [],  # No authorization endpoint
            "scopes_supported": ["aap:research", "aap:content-creation", "aap:data-analysis"],
        }
    )


@app.route("/.well-known/jwks.json")
def jwks():
    """JSON Web Key Set (JWKS) endpoint"""
    # TODO: Implement proper JWKS with public key
    # For now, return empty set (requires cryptography library to export public key in JWK format)
    return jsonify({"keys": []})


@app.route("/token", methods=["POST"])
def token():
    """
    Token endpoint - handles Client Credentials Grant and Token Exchange

    Implements:
    - OAuth 2.0 Client Credentials Grant (RFC 6749 Section 4.4)
    - OAuth 2.0 Token Exchange (RFC 8693)
    """
    grant_type = request.form.get("grant_type")

    if grant_type == "client_credentials":
        return handle_client_credentials()
    elif grant_type == "urn:ietf:params:oauth:grant-type:token-exchange":
        return handle_token_exchange()
    else:
        return (
            jsonify(
                {
                    "error": "unsupported_grant_type",
                    "error_description": f"Grant type '{grant_type}' is not supported",
                }
            ),
            400,
        )


def handle_client_credentials():
    """Handle Client Credentials Grant for initial token issuance"""
    # Extract parameters
    client_id = request.form.get("client_id")
    client_secret = request.form.get("client_secret")

    # Authentication (simplified - production should use proper client auth)
    if not client_id or not client_secret:
        return (
            jsonify(
                {
                    "error": "invalid_client",
                    "error_description": "Client authentication failed",
                }
            ),
            401,
        )

    # TODO: Validate client credentials against database
    # For reference implementation, accept any client with secret "secret"
    if client_secret != "secret":
        return (
            jsonify(
                {
                    "error": "invalid_client",
                    "error_description": "Invalid client credentials",
                }
            ),
            401,
        )

    # Extract AAP-specific parameters from request
    # In production, these might come from request body as JSON or from client registration
    agent_type = request.form.get("agent_type", "llm-autonomous")
    operator = request.form.get("operator", "org:default")
    task_id = request.form.get("task_id", "task-default")
    task_purpose = request.form.get("task_purpose", "general")
    audience = request.form.get("audience", "https://api.example.com")
    requested_capabilities = request.form.get("capabilities", "search.web").split(",")

    # Parse optional metadata
    agent_metadata = {}
    if request.form.get("agent_metadata"):
        try:
            agent_metadata = json.loads(request.form.get("agent_metadata"))
        except json.JSONDecodeError:
            pass

    task_metadata = {}
    if request.form.get("task_metadata"):
        try:
            task_metadata = json.loads(request.form.get("task_metadata"))
        except json.JSONDecodeError:
            pass

    try:
        # Issue token
        access_token = token_issuer.issue_token(
            agent_id=client_id,
            agent_type=agent_type,
            operator=operator,
            task_id=task_id,
            task_purpose=task_purpose,
            requested_capabilities=requested_capabilities,
            audience=audience,
            agent_metadata=agent_metadata,
            task_metadata=task_metadata,
        )

        return jsonify(
            {
                "access_token": access_token,
                "token_type": "Bearer",
                "expires_in": config.default_token_lifetime,
                "scope": "aap:" + task_purpose,
            }
        )

    except ValueError as e:
        return (
            jsonify(
                {
                    "error": "invalid_request",
                    "error_description": str(e),
                }
            ),
            400,
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


def handle_token_exchange():
    """Handle Token Exchange for delegation (RFC 8693)"""
    # Extract parameters
    subject_token = request.form.get("subject_token")
    subject_token_type = request.form.get("subject_token_type")
    resource = request.form.get("resource")  # New audience
    requested_capabilities = request.form.get("scope", "").split(",") if request.form.get("scope") else None

    # Validate parameters
    if not subject_token:
        return (
            jsonify(
                {
                    "error": "invalid_request",
                    "error_description": "subject_token is required",
                }
            ),
            400,
        )

    if subject_token_type != "urn:ietf:params:oauth:token-type:access_token":
        return (
            jsonify(
                {
                    "error": "invalid_request",
                    "error_description": "subject_token_type must be access_token",
                }
            ),
            400,
        )

    if not resource:
        return (
            jsonify(
                {
                    "error": "invalid_request",
                    "error_description": "resource (new audience) is required",
                }
            ),
            400,
        )

    try:
        # Perform token exchange
        derived_token = token_issuer.exchange_token(
            parent_token=subject_token,
            new_audience=resource,
            public_key=public_key,
            requested_capabilities=requested_capabilities,
        )

        # Calculate expires_in from token
        import jwt
        payload = jwt.decode(derived_token, options={"verify_signature": False})
        expires_in = payload["exp"] - payload["iat"]

        return jsonify(
            {
                "access_token": derived_token,
                "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
                "token_type": "Bearer",
                "expires_in": expires_in,
            }
        )

    except ValueError as e:
        return (
            jsonify(
                {
                    "error": "invalid_grant",
                    "error_description": str(e),
                }
            ),
            400,
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


def run_server():
    """Run the Authorization Server"""
    print(f"Starting AAP Authorization Server")
    print(f"Issuer: {config.issuer}")
    print(f"Listening on {config.host}:{config.port}")
    print(f"Token endpoint: /token")
    print(f"JWKS endpoint: /.well-known/jwks.json")
    app.run(host=config.host, port=config.port, debug=True)


if __name__ == "__main__":
    run_server()
