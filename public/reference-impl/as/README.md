# AAP Authorization Server - Reference Implementation

This is a reference implementation of an OAuth 2.0 Authorization Server that issues AAP (Agent Authorization Profile) tokens.

## Features

- **Client Credentials Grant** (RFC 6749 Section 4.4) for initial token issuance
- **Token Exchange** (RFC 8693) for delegation with privilege reduction
- **Policy-based authorization** with operator-specific policies
- **ES256 token signing** (ECDSA with P-256 curve)
- **AAP-compliant tokens** with agent, task, capabilities, delegation, oversight, and audit claims

## Quick Start

### 1. Install Dependencies

```bash
cd reference-impl
pip install -r requirements.txt
```

### 2. Generate Keys

```bash
cd scripts
chmod +x generate_keys.sh
./generate_keys.sh
```

This generates:
- `keys/as_private_key.pem` - Private key for signing tokens (keep secure!)
- `keys/as_public_key.pem` - Public key for token verification

### 3. Configure Policies

Edit policies in `policies/` directory. Example policy is provided at `policies/org-acme-corp.json`.

Policy structure:
```json
{
  "policy_id": "policy-name",
  "applies_to": {
    "operator": "org:your-org"
  },
  "allowed_capabilities": [
    {
      "action": "search.web",
      "default_constraints": {
        "domains_allowed": ["example.org"],
        "max_requests_per_hour": 100
      }
    }
  ],
  "global_constraints": {
    "token_lifetime": 3600,
    "max_delegation_depth": 2
  },
  "oversight": {
    "requires_human_approval_for": ["cms.publish"]
  }
}
```

### 4. Run the Server

```bash
cd as
python server.py
```

Server will start on `http://localhost:8080` by default.

## Endpoints

### Token Endpoint: `POST /token`

#### Client Credentials Grant (Initial Token)

Request:
```http
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=agent-researcher-01
&client_secret=secret
&operator=org:acme-corp
&task_id=task-123
&task_purpose=research_climate_data
&capabilities=search.web,data.analyze
&audience=https://api.example.com
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "aap:research_climate_data"
}
```

#### Token Exchange (Delegation)

Request:
```http
POST /token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=eyJhbGc...
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&resource=https://tool-scraper.example.com
&scope=search.web
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer",
  "expires_in": 1800
}
```

### Metadata Endpoint: `GET /.well-known/oauth-authorization-server`

Returns OAuth 2.0 Authorization Server Metadata (RFC 8414).

### JWKS Endpoint: `GET /.well-known/jwks.json`

Returns JSON Web Key Set with public keys for token verification.

## Configuration

Environment variables:

- `AAP_ISSUER` - Issuer URL (default: `https://as.example.com`)
- `AAP_AS_PORT` - Server port (default: `8080`)
- `AAP_AS_HOST` - Server host (default: `0.0.0.0`)
- `AAP_SIGNING_ALGORITHM` - Token signing algorithm (default: `ES256`)
- `AAP_PRIVATE_KEY_PATH` - Path to private key (default: `keys/as_private_key.pem`)
- `AAP_PUBLIC_KEY_PATH` - Path to public key (default: `keys/as_public_key.pem`)
- `AAP_POLICY_PATH` - Path to policies directory (default: `policies`)
- `AAP_DEFAULT_TOKEN_LIFETIME` - Default token lifetime in seconds (default: `3600`)
- `AAP_DEFAULT_MAX_DELEGATION_DEPTH` - Default max delegation depth (default: `2`)

## Example: Issue and Decode a Token

```python
import requests
import jwt

# Request token
response = requests.post(
    "http://localhost:8080/token",
    data={
        "grant_type": "client_credentials",
        "client_id": "agent-researcher-01",
        "client_secret": "secret",
        "operator": "org:acme-corp",
        "task_id": "task-123",
        "task_purpose": "research_climate_data",
        "capabilities": "search.web",
        "audience": "https://api.example.com",
    },
)

token = response.json()["access_token"]
print(f"Token: {token[:50]}...")

# Decode token (verification requires public key)
payload = jwt.decode(token, options={"verify_signature": False})
print("\nToken payload:")
print(f"  Agent: {payload['agent']['id']}")
print(f"  Task: {payload['task']['purpose']}")
print(f"  Capabilities: {[cap['action'] for cap in payload['capabilities']]}")
print(f"  Delegation depth: {payload['delegation']['depth']}")
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Authorization Server                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   HTTP       │  │   Token      │  │   Policy     │  │
│  │   Server     │─▶│   Issuer     │─▶│   Engine     │  │
│  │  (Flask)     │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │         │
│         │                  │                  ▼         │
│         │                  │          ┌──────────────┐  │
│         │                  │          │   Operator   │  │
│         │                  │          │   Policies   │  │
│         │                  │          │   (JSON)     │  │
│         │                  │          └──────────────┘  │
│         │                  │                            │
│         │                  ▼                            │
│         │          ┌──────────────┐                     │
│         │          │   Private    │                     │
│         │          │   Key        │                     │
│         │          │   (ES256)    │                     │
│         │          └──────────────┘                     │
│         │                                               │
│         ▼                                               │
│  ┌──────────────────────────────────────┐              │
│  │  OAuth 2.0 Endpoints:                │              │
│  │  • POST /token                       │              │
│  │  • GET /.well-known/jwks.json        │              │
│  │  • GET /.well-known/oauth-as-metadata│              │
│  └──────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Token Structure

Generated tokens include:

**Standard JWT claims:**
- `iss` - Issuer (AS URL)
- `sub` - Subject (agent ID)
- `aud` - Audience (RS URL)
- `exp` - Expiration timestamp
- `iat` - Issued at timestamp
- `jti` - JWT ID (unique token identifier)

**AAP claims:**
- `agent` - Agent identity (`id`, `type`, `operator`, etc.)
- `task` - Task binding (`id`, `purpose`, `created_at`, etc.)
- `capabilities` - Array of capabilities with constraints
- `delegation` - Delegation tracking (`depth`, `max_depth`, `chain`, `parent_jti`)
- `oversight` - Human oversight requirements (optional)
- `audit` - Audit and logging requirements (optional)

## Testing

Run tests:
```bash
cd ../tests
pytest test_as.py -v
```

## Security Considerations

**Production Deployment:**

1. **Private Key Security:**
   - Store private keys in HSM or secure key management service
   - Never commit private keys to version control
   - Rotate keys every 90 days

2. **Client Authentication:**
   - Replace simple `client_secret=secret` with proper client authentication
   - Use client certificates (mTLS) for high-security environments
   - Implement client registration with credential management

3. **TLS:**
   - Always use HTTPS in production
   - Configure TLS 1.3 with strong cipher suites

4. **Rate Limiting:**
   - Implement rate limiting on `/token` endpoint
   - Monitor for anomalous token issuance patterns

5. **Revocation:**
   - Implement token revocation endpoint (RFC 7009)
   - Maintain revocation list with rapid propagation to RSs

## License

Reference implementation for AAP specification. See main project LICENSE.
