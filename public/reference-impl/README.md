# AAP Reference Implementation

Reference implementation of the Agent Authorization Profile (AAP) for OAuth 2.0.

This implementation demonstrates:
- **Authorization Server (AS)** - Issues AAP tokens with agent, task, and capability claims
- **Resource Server (RS)** - Validates tokens and enforces constraints
- **Policy Engine** - Operator-specific authorization policies
- **Token Exchange** - OAuth 2.0 Token Exchange for delegation with privilege reduction

## Project Structure

```
reference-impl/
├── as/                          # Authorization Server
│   ├── __init__.py
│   ├── config.py               # AS configuration
│   ├── policy_engine.py        # Policy evaluation
│   ├── token_issuer.py         # Token issuance and exchange
│   ├── server.py               # HTTP server (Flask)
│   └── README.md               # AS documentation
├── rs/                          # Resource Server
│   ├── __init__.py
│   ├── validator.py            # Token validation
│   ├── capability_matcher.py   # Action matching
│   ├── constraint_enforcer.py  # Constraint enforcement
│   ├── server.py               # HTTP server (Flask)
│   └── README.md               # RS documentation
├── policies/                    # Operator policies
│   └── org-acme-corp.json      # Example policy
├── keys/                        # Cryptographic keys
│   ├── as_private_key.pem      # AS signing key (generated)
│   └── as_public_key.pem       # AS public key (generated)
├── scripts/                     # Utility scripts
│   └── generate_keys.sh        # Generate ES256 keys
├── tests/                       # Test suite
│   ├── test_as.py              # AS tests
│   └── test_rs.py              # RS tests
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Generate Keys

```bash
cd scripts
chmod +x generate_keys.sh
./generate_keys.sh
cd ..
```

This creates:
- `keys/as_private_key.pem` - Private key for signing tokens (ES256)
- `keys/as_public_key.pem` - Public key for verifying tokens

### 3. Start Authorization Server

Terminal 1:
```bash
cd as
python server.py
```

AS starts on `http://localhost:8080`

### 4. Start Resource Server

Terminal 2:
```bash
cd rs
python server.py
```

RS starts on `http://localhost:8081`

### 5. Test End-to-End Flow

Terminal 3:

**Step 1: Get a token from AS**
```bash
curl -X POST http://localhost:8080/token \
  -d "grant_type=client_credentials" \
  -d "client_id=agent-researcher-01" \
  -d "client_secret=secret" \
  -d "operator=org:acme-corp" \
  -d "task_id=task-123" \
  -d "task_purpose=research_climate_data" \
  -d "capabilities=search.web" \
  -d "audience=https://api.example.com"
```

**Step 2: Use token to access protected resource**
```bash
# Save token from previous response
TOKEN="eyJhbGc..."

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8081/api/search?q=climate&url=https://example.org/data"
```

**Step 3: Test delegation (Token Exchange)**
```bash
curl -X POST http://localhost:8080/token \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "subject_token=$TOKEN" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:access_token" \
  -d "resource=https://tool-scraper.example.com" \
  -d "scope=search.web"
```

## Features Implemented

### Authorization Server

✅ **Client Credentials Grant** (RFC 6749 Section 4.4)
- Agent authentication (simplified; client_secret validation)
- Policy-based capability evaluation
- Token issuance with AAP claims

✅ **Token Exchange** (RFC 8693)
- Parent token validation
- Privilege reduction (capability subset, constraint tightening, lifetime reduction)
- Delegation depth increment
- Chain tracking

✅ **Policy Engine**
- Operator-specific policies (JSON format)
- Capability matching and constraint merging
- Delegation-based privilege reduction

✅ **Token Signing**
- ES256 (ECDSA P-256) signatures
- RS256 support (for compatibility)
- JWT with AAP claims structure

✅ **Metadata Endpoints**
- OAuth 2.0 Authorization Server Metadata (RFC 8414)
- JWKS endpoint (placeholder)

### Resource Server

✅ **Token Validation** (Specification Section 7.1)
- JWT signature verification
- Expiration checking (with 5-minute clock skew tolerance)
- Audience validation
- Issuer validation

✅ **Agent Identity Validation** (Section 7.3)
- Required field checking (`id`, `type`, `operator`)

✅ **Task Binding Validation** (Section 7.4)
- Required field checking (`id`, `purpose`)

✅ **Capability Enforcement** (Section 7.5)
- Exact action name matching (case-sensitive)
- `aap_invalid_capability` error if no match

✅ **Constraint Enforcement** (Section 5.6)
- Rate limiting: `max_requests_per_hour`, `max_requests_per_minute`
- Domain restrictions: `domains_allowed`, `domains_blocked`
- Time windows: `time_window.start`, `time_window.end`
- HTTP methods: `allowed_methods`
- Request size: `max_request_size`

✅ **Oversight Enforcement** (Section 7.6)
- `requires_human_approval_for` checking
- `aap_approval_required` error

✅ **Delegation Validation** (Section 7.7)
- Depth validation (`depth <= max_depth`)
- Chain length validation (`len(chain) == depth + 1`)

✅ **Privacy-Preserving Errors** (Section 13.5)
- Generic error messages (no constraint values leaked)
- Server-side detailed logging

## Example Scenarios

### Scenario 1: Basic Token Issuance and Use

1. Agent requests token with `search.web` capability
2. AS evaluates against operator policy
3. AS issues token with constraints (domains_allowed, rate limits)
4. Agent uses token to access RS endpoint
5. RS validates token and enforces constraints
6. Request succeeds (200) if within constraints

### Scenario 2: Constraint Violation

1. Agent makes 101st request when `max_requests_per_hour: 100`
2. RS constraint enforcer detects violation
3. RS returns 429 with `aap_constraint_violation` error

### Scenario 3: Domain Restriction

1. Agent requests URL: `https://malicious.com/data`
2. Token has `domains_allowed: ["example.org"]`
3. RS constraint enforcer checks domain
4. Domain doesn't match allowlist
5. RS returns 403 with `aap_domain_not_allowed` error

### Scenario 4: Delegation with Privilege Reduction

1. Agent A has token with 2 capabilities, lifetime 3600s
2. Agent A exchanges token for Tool B (delegation)
3. AS reduces capabilities to subset (1 capability)
4. AS tightens constraints (rate limit 100 → 50)
5. AS reduces lifetime (3600s → 1800s)
6. AS increments depth (0 → 1)
7. AS appends to chain (["agent-A"] → ["agent-A", "tool-B"])
8. Tool B receives derived token with reduced privileges

### Scenario 5: Human Approval Required

1. Agent requests `cms.publish` action
2. Policy has `oversight.requires_human_approval_for: ["cms.publish"]`
3. RS checks oversight claim
4. Action is in approval list
5. RS returns 403 with `aap_approval_required` and approval reference URL

## Testing

Run test suite:
```bash
cd tests
pytest -v
```

Run specific tests:
```bash
pytest test_as.py -v          # AS tests
pytest test_rs.py -v          # RS tests
pytest test_integration.py -v # End-to-end tests
```

## Configuration

### Authorization Server

Environment variables:
- `AAP_ISSUER` - Issuer URL (default: `https://as.example.com`)
- `AAP_AS_PORT` - Port (default: `8080`)
- `AAP_SIGNING_ALGORITHM` - Algorithm (default: `ES256`)
- `AAP_PRIVATE_KEY_PATH` - Private key path
- `AAP_POLICY_PATH` - Policies directory
- `AAP_DEFAULT_TOKEN_LIFETIME` - Default lifetime in seconds (default: `3600`)
- `AAP_DEFAULT_MAX_DELEGATION_DEPTH` - Max delegation depth (default: `2`)

### Resource Server

Environment variables:
- `AAP_RS_AUDIENCE` - This RS's audience identifier (default: `https://api.example.com`)
- `AAP_RS_PORT` - Port (default: `8081`)
- `AAP_TRUSTED_ISSUERS` - Comma-separated trusted AS issuers
- `AAP_PUBLIC_KEY_PATH` - AS public key path

## Policy Configuration

Policies are defined in JSON format in the `policies/` directory.

Example policy (`policies/org-acme-corp.json`):
```json
{
  "policy_id": "policy-research-agents-v1",
  "applies_to": {
    "operator": "org:acme-corp"
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

## Limitations (Reference Implementation)

This is a **reference implementation** for demonstration and testing. Production deployments require additional features:

❌ **Client Authentication** - Simplified (client_secret="secret"); production needs proper credential management

❌ **Revocation** - Not implemented; production needs revocation endpoint + list distribution

❌ **Distributed Rate Limiting** - In-memory counters (single instance); production needs Redis/Memcached

❌ **JWKS** - Placeholder endpoint; production needs proper JWK export

❌ **DPoP / mTLS** - PoP validation not implemented; production should enforce

❌ **Database** - No persistence; production needs database for policies, clients, revocation list

❌ **Multi-Tenancy** - Basic operator separation; production needs proper isolation

❌ **Monitoring** - Basic logging; production needs metrics, alerting, audit logs

❌ **High Availability** - Single instance; production needs load balancing, replication

## Security Considerations

**⚠️ WARNING: This is a reference implementation for testing and demonstration only.**

For production deployment:

1. **Key Management**
   - Use HSM or secure key management service
   - Rotate keys every 90 days
   - Never commit private keys to version control

2. **Client Authentication**
   - Implement proper client registration
   - Use mTLS for agent authentication
   - Validate client credentials against secure database

3. **TLS**
   - Always use HTTPS in production
   - TLS 1.3 with strong cipher suites

4. **Rate Limiting**
   - Implement distributed rate limiting (Redis)
   - Rate limit on token endpoint (prevent token issuance abuse)

5. **Revocation**
   - Implement revocation endpoint (RFC 7009)
   - Distribute revocation list to RSs within 60 seconds
   - Cache revocation status with short TTL

6. **Monitoring**
   - Log all token issuance and validation failures
   - Monitor for anomalous patterns
   - Alert on unusual agent activity

## Contributing

This reference implementation demonstrates the AAP specification. Contributions that improve clarity, add test coverage, or demonstrate additional features are welcome.

## License

Reference implementation for AAP specification. See main project LICENSE.

## See Also

- [AAP Specification](/docs/AAP_Complete_Draft_Specification.md)
- [JSON Schemas](/schemas/)
- [Threat Model](/docs/Threat_Model_Detailed.md)
- [Authorization Server README](as/README.md)
- [Resource Server README](rs/README.md)
