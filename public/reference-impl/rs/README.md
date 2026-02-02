# AAP Resource Server - Reference Implementation

This is a reference implementation of a Resource Server that validates and enforces AAP (Agent Authorization Profile) tokens.

## Features

- **JWT validation** with signature verification, expiration, and audience checks
- **Agent identity validation** per AAP specification Section 7.3
- **Task binding validation** per AAP specification Section 7.4
- **Capability matching** with exact action name matching (Section 7.5)
- **Constraint enforcement** (Section 5.6):
  - Rate limiting (hourly, per-minute)
  - Domain allowlist/blocklist
  - Time windows
  - HTTP method restrictions
  - Request size limits
- **Delegation validation** (Section 7.7)
- **Oversight enforcement** (Section 7.6)
- **Privacy-preserving error messages** (Section 13.5)

## Quick Start

### 1. Install Dependencies

```bash
cd reference-impl
pip install -r requirements.txt
```

### 2. Obtain AS Public Key

Copy the public key from the Authorization Server:

```bash
cp ../keys/as_public_key.pem keys/
```

### 3. Run the Server

```bash
cd rs
python server.py
```

Server will start on `http://localhost:8081` by default.

## Example Usage

### 1. Get a Token from AS

```bash
curl -X POST http://localhost:8080/token \
  -d "grant_type=client_credentials" \
  -d "client_id=agent-researcher-01" \
  -d "client_secret=secret" \
  -d "operator=org:acme-corp" \
  -d "task_id=task-123" \
  -d "task_purpose=research_climate_data" \
  -d "capabilities=search.web,cms.create_draft" \
  -d "audience=https://api.example.com"
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 2. Use Token to Access Protected Endpoint

```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  "http://localhost:8081/api/search?q=climate&url=https://example.org/data"
```

Success response (200):
```json
{
  "status": "success",
  "message": "Search authorized",
  "query": "climate",
  "target_url": "https://example.org/data",
  "agent": "agent-researcher-01",
  "task": "task-123"
}
```

### 3. Domain Constraint Violation

```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  "http://localhost:8081/api/search?q=test&url=https://malicious.com/data"
```

Error response (403):
```json
{
  "error": "aap_constraint_violation",
  "error_description": "Request violates capability constraints"
}
```

### 4. Rate Limit Violation

After exceeding `max_requests_per_hour`:

Error response (429):
```json
{
  "error": "aap_constraint_violation",
  "error_description": "Request violates capability constraints"
}
```

### 5. Approval Required

```bash
curl -X POST -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:8081/api/cms/publish \
  -H "Content-Type: application/json" \
  -d '{"article_id": "123"}'
```

Error response (403):
```json
{
  "error": "aap_approval_required",
  "error_description": "This action requires human approval. Reference: https://approval.acme-corp.com/agent-actions"
}
```

## API Endpoints

### Protected Endpoints

#### `GET /api/search`

Search endpoint requiring `search.web` capability.

Parameters:
- `q` - Search query
- `url` - Target URL (validated against `domains_allowed`)

Capability required:
```json
{
  "action": "search.web",
  "constraints": {
    "domains_allowed": ["example.org"],
    "max_requests_per_hour": 100
  }
}
```

#### `POST /api/cms/draft`

Create draft endpoint requiring `cms.create_draft` capability.

Request body: JSON with article content

Capability required:
```json
{
  "action": "cms.create_draft"
}
```

#### `POST /api/cms/publish`

Publish endpoint requiring `cms.publish` capability (with human approval).

Request body: JSON with article ID

Capability required:
```json
{
  "action": "cms.publish"
}
```

Oversight:
```json
{
  "oversight": {
    "requires_human_approval_for": ["cms.publish"]
  }
}
```

## Configuration

Environment variables:

- `AAP_RS_AUDIENCE` - This Resource Server's audience identifier (default: `https://api.example.com`)
- `AAP_RS_PORT` - Server port (default: `8081`)
- `AAP_RS_HOST` - Server host (default: `0.0.0.0`)
- `AAP_TRUSTED_ISSUERS` - Comma-separated list of trusted AS issuers (default: `https://as.example.com`)
- `AAP_PUBLIC_KEY_PATH` - Path to AS public key (default: `../keys/as_public_key.pem`)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Resource Server                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐                                        │
│  │   HTTP       │                                        │
│  │   Server     │                                        │
│  │  (Flask)     │                                        │
│  └──────┬───────┘                                        │
│         │                                                │
│         ▼                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Token      │─▶│  Capability  │─▶│  Constraint  │  │
│  │  Validator   │  │   Matcher    │  │  Enforcer    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │         │
│         ▼                  ▼                  ▼         │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Validation Pipeline:                           │  │
│  │   1. JWT signature & expiration                  │  │
│  │   2. Agent identity                              │  │
│  │   3. Task binding                                │  │
│  │   4. Capability matching                         │  │
│  │   5. Constraint enforcement                      │  │
│  │   6. Oversight check                             │  │
│  │   7. Delegation validation                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Validation Pipeline

When a request arrives with an AAP token:

1. **Extract Token** - Extract Bearer token from Authorization header
2. **JWT Validation** (Section 7.1)
   - Verify signature with AS public key
   - Check expiration (with 5-minute clock skew tolerance)
   - Validate audience matches this RS
   - Validate issuer is trusted
3. **Agent Identity** (Section 7.3)
   - Validate agent claim is present and well-formed
   - Check required fields: `id`, `type`, `operator`
4. **Task Binding** (Section 7.4)
   - Validate task claim is present
   - Check required fields: `id`, `purpose`
5. **Capability Matching** (Section 7.5)
   - Find capability with matching `action` (exact string match)
   - Return 403 `aap_invalid_capability` if no match
6. **Constraint Enforcement** (Section 5.6)
   - Enforce ALL constraints (AND semantics)
   - Rate limiting (hourly, per-minute)
   - Domain allowlist/blocklist
   - Time windows
   - HTTP method restrictions
   - Request size limits
   - Return 429 or 403 `aap_constraint_violation` if violated
7. **Oversight Check** (Section 7.6)
   - Check if action requires human approval
   - Return 403 `aap_approval_required` if approval needed
8. **Delegation Validation** (Section 7.7)
   - Validate delegation depth <= max_depth
   - Validate chain length matches depth+1
   - Return 403 `aap_excessive_delegation` if violated

If all checks pass, request is authorized and processed.

## Error Codes

The RS returns AAP-specific error codes (Appendix C):

| Error Code | HTTP Status | Description |
|-----------|-------------|-------------|
| `invalid_token` | 401 | Token validation failed (signature, expiration, audience) |
| `aap_invalid_capability` | 403 | No matching capability for requested action |
| `aap_constraint_violation` | 403 or 429 | Constraint violated (rate limit, domain, time window) |
| `aap_approval_required` | 403 | Action requires human approval |
| `aap_excessive_delegation` | 403 | Delegation depth exceeded |
| `aap_domain_not_allowed` | 403 | Target domain not in allowlist |

All error messages are privacy-preserving (do not leak constraint values).

## Testing

Run tests:
```bash
cd ../tests
pytest test_rs.py -v
```

## Production Deployment

**Rate Limiting:**
- Current implementation uses in-memory counters (single instance only)
- Production MUST use distributed rate limiting (Redis, Memcached, etc.)

**Key Management:**
- Obtain AS public key from JWKS endpoint (`/.well-known/jwks.json`)
- Support multiple public keys (for key rotation)
- Refresh JWKS periodically (every 24 hours recommended)

**Revocation:**
- Implement revocation checking (introspection endpoint or revocation list)
- Cache revocation status with short TTL (1-5 minutes)

**Monitoring:**
- Log all authorization failures with correlation IDs
- Monitor rate limit violations (detect abuse)
- Alert on unusual agent activity

**TLS:**
- Always use HTTPS in production
- Configure TLS 1.3 with strong cipher suites

## License

Reference implementation for AAP specification. See main project LICENSE.
