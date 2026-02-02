# AAP Frequently Asked Questions (FAQ)

## General Questions

### Q1: What is AAP?

**A:** AAP (Agent Authorization Profile) is an authorization profile for OAuth 2.0 designed specifically for autonomous AI agents. It extends OAuth 2.0 with structured claims that enable:
- Explicit agent identity
- Task-bound authorization
- Capability-based permissions with enforceable constraints
- Delegation tracking with audit trails
- Human oversight requirements

Think of it as "OAuth 2.0 for AI agents" with built-in security, audit, and policy features.

### Q2: How is AAP different from regular OAuth 2.0?

**A:**

| Feature | OAuth 2.0 Scopes | AAP |
|---------|-----------------|-----|
| **Granularity** | Coarse (`read:articles`) | Fine-grained (`cms.read_articles` + constraints) |
| **Constraints** | None | Built-in (rate limits, domains, time windows) |
| **Task Context** | No | Yes (`task.purpose`, `task.id`) |
| **Delegation** | Not tracked | Full chain with depth limits |
| **Oversight** | External | Native (`requires_human_approval_for`) |
| **Audit** | Manual | Integrated (`trace_id`, delegation chain) |

AAP maintains full OAuth 2.0 compatibility while adding agent-specific features.

### Q3: Do I need to replace my existing OAuth AS?

**A:** No. You can:
- **Option 1:** Extend your existing OAuth AS to issue AAP claims alongside standard claims
- **Option 2:** Run AAP AS separately and use both
- **Option 3:** Migrate fully to AAP AS (recommended for greenfield)

Resource Servers can validate both OAuth scope tokens and AAP capability tokens during transition.

### Q4: Is AAP an official standard?

**A:** AAP is currently an Internet-Draft submitted to the IETF OAuth Working Group (draft-aap-oauth-profile-00). It builds on established RFCs:
- RFC 6749 (OAuth 2.0)
- RFC 7519 (JWT)
- RFC 8693 (Token Exchange)
- RFC 9449 (DPoP)
- RFC 8705 (mTLS)

---

## Technical Questions

### Q5: What programming languages are supported?

**A:** AAP is a protocol specification, not tied to any language. Reference implementations are provided in Python, but AAP can be implemented in any language with:
- JWT libraries (signing/verification)
- HTTP client/server capabilities
- JSON Schema validation (recommended)

Community implementations exist for: Go, TypeScript, Rust, Java.

### Q6: Do agents need to change how they request tokens?

**A:** Yes, but minimally. Instead of:

```http
POST /token
grant_type=client_credentials&scope=read:articles
```

Agents send:

```http
POST /token
grant_type=client_credentials
&operator=org:acme-corp
&task_id=task-123
&task_purpose=research_articles
&capabilities=cms.read_articles
&audience=https://api.example.com
```

The response is still a standard OAuth token response.

### Q7: How do I validate AAP tokens?

**A:** AAP tokens are standard JWTs. Validation steps:

1. **Standard JWT validation:**
   - Verify signature with AS public key
   - Check expiration (`exp` claim)
   - Validate audience (`aud` claim)

2. **AAP-specific validation:**
   - Validate `agent` claim is present
   - Validate `task` claim is present
   - Match requested action to `capabilities` array
   - Enforce constraints in matching capability

See [Reference RS Implementation](/reference-impl/rs/) for code examples.

### Q8: What if my agent doesn't fit the AAP model?

**A:** AAP is designed for autonomous agents, but flexibility exists:

- **Simple bots/scripts:** Use minimal AAP claims (required fields only)
- **User-facing apps:** AAP can coexist with traditional OAuth for user flows
- **Non-autonomous services:** Consider whether OAuth scopes are sufficient

If your "agent" is really just an API client with no autonomy, OAuth scopes may be simpler.

### Q9: How do I handle delegation?

**A:** Use OAuth 2.0 Token Exchange (RFC 8693):

```python
# Agent delegates to tool
response = requests.post(
    'https://as.example.com/token',
    data={
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'subject_token': parent_token,  # Original agent token
        'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
        'resource': 'https://tool.example.com',  # Tool's audience
        'scope': 'search.web'  # Subset of parent capabilities
    }
)

derived_token = response.json()['access_token']
```

The AS automatically:
- Increments `delegation.depth`
- Appends to `delegation.chain`
- Reduces privileges (rate limits, lifetime)

### Q10: What constraints are supported?

**A:** Standard constraint types (Section 5.6 of spec):

**Rate Limiting:**
- `max_requests_per_hour` - Fixed hourly quota
- `max_requests_per_minute` - Sliding 60-second window
- `max_requests_per_day` - Daily quota

**Domain Restrictions:**
- `domains_allowed` - DNS suffix matching
- `domains_blocked` - Blocklist (takes precedence)

**Time Windows:**
- `time_window.start` / `end` - ISO 8601 timestamps

**Data Constraints:**
- `allowed_methods` - HTTP methods (GET, POST, etc.)
- `max_request_size` - Payload size limit
- `max_response_size` - Response size limit
- `data_classification_max` - Data sensitivity level

**Delegation:**
- `max_depth` - Maximum delegation depth

You can add custom constraints by extending the schema.

---

## Security Questions

### Q11: Is AAP secure?

**A:** AAP provides security features beyond OAuth 2.0:

**Strengths:**
- Proof-of-possession (DPoP, mTLS) binds tokens to keys
- Short-lived tokens with rapid revocation
- Constraint enforcement prevents abuse (rate limits, domain restrictions)
- Delegation tracking provides audit trail
- Task binding prevents token misuse
- Mandatory audit logging

**Security depends on:**
- Proper key management (use HSM in production)
- TLS everywhere (prevent token interception)
- Proof-of-possession enforcement (prevent token replay)
- Constraint tuning (set appropriate rate limits)

See [Threat Model](/docs/Threat_Model_Detailed.md) for comprehensive security analysis.

### Q12: How do I prevent token theft?

**A:** Multiple layers:

1. **Transport Security:** Always use TLS 1.3
2. **Proof-of-Possession:** Bind token to client key (DPoP or mTLS)
   - Token theft is useless without the private key
3. **Short Lifetime:** Tokens expire in minutes (not hours/days)
4. **Token Revocation:** Rapid revocation when compromise detected
5. **Audit Logging:** Detect anomalous usage patterns

**Recommendation:** Proof-of-possession is RECOMMENDED in spec but SHOULD be REQUIRED for high-risk capabilities.

### Q13: What happens if the AS is compromised?

**A:** AS compromise is critical because it can mint arbitrary tokens.

**Mitigations:**
- **HSM:** Store AS private keys in Hardware Security Module
  - Keys are not extractable even if AS is compromised
- **Multi-Party Authorization:** Key use requires quorum
- **Monitoring:** Detect anomalous token issuance
- **Key Rotation:** Rotate every 90 days (limits blast radius)
- **Segmentation:** Run AS in isolated network segment

**Recovery:**
- Rotate AS keys immediately
- Revoke all outstanding tokens
- Audit token issuance logs for malicious grants

See Threat Model Section 3.10 for detailed analysis.

### Q14: How do I handle revocation?

**A:** Implement OAuth 2.0 Token Revocation (RFC 7009):

**AS Side:**
```python
@app.route('/revoke', methods=['POST'])
def revoke_token():
    token = request.form.get('token')
    # Add token JTI to revocation list
    revocation_list.add(get_jti(token))
    # Distribute to RSs within 60 seconds
    distribute_revocation(get_jti(token))
    return '', 200
```

**RS Side:**
```python
def validate_token(token):
    # ... standard validation ...
    if token_jti in revocation_list:
        raise TokenRevoked()
```

**Distribution:**
- Push-based: AS pushes revocations to RSs (SSE, WebSocket, message queue)
- Pull-based: RS polls revocation list every 30 seconds
- Hybrid: Push + poll fallback

**SLA:** "Rapid revocation" = max 60 seconds from revocation to enforcement.

---

## Deployment Questions

### Q15: Can I run AAP in production?

**A:** Yes, with proper deployment:

**Required for Production:**
- HSM or cloud key management (AWS KMS, GCP Secret Manager)
- Distributed rate limiting (Redis, Memcached)
- TLS 1.3 everywhere
- High availability (3+ AS replicas)
- Monitoring and alerting
- Revocation mechanism
- Audit logging to SIEM

**Not Required (Reference Implementation):**
- Reference implementation is production-ready for small deployments
- For large scale, consider commercial solutions or custom implementation

See [Deployment Patterns](/docs/Deployment_Patterns.md).

### Q16: What's the performance impact?

**A:** AAP validation adds minimal overhead:

**Token Issuance (AS):**
- JWT signing: ~1-2ms (ES256)
- Policy evaluation: ~0.5-1ms
- Total: ~2-3ms per token

**Token Validation (RS):**
- JWT verification: ~1-2ms
- Constraint enforcement: ~0.5-1ms (in-memory)
- Total: ~2-3ms per request

**Bottlenecks:**
- Distributed rate limiting: +1-5ms (Redis network call)
- Revocation checking: +1-5ms (if introspection used)

**Recommendation:** Use connection pooling for Redis, cache revocation lists.

### Q17: How does AAP scale?

**A:**

**Authorization Server:**
- **Horizontal Scaling:** Stateless, can run many replicas
- **Bottleneck:** Policy database (use caching)
- **Tested:** 10k+ tokens/sec on modest hardware

**Resource Server:**
- **Horizontal Scaling:** Stateless validation
- **Bottleneck:** Distributed rate limiting (Redis)
- **Tested:** 50k+ requests/sec with Redis

**Key Scaling Strategies:**
- Cache policies in memory (refresh every 5 minutes)
- Use Redis cluster for rate limiting
- Regional AS deployment (reduce latency)
- Pre-fetch JWKS (don't fetch AS public key per request)

---

## Compliance and Privacy Questions

### Q18: Is AAP GDPR compliant?

**A:** AAP is GDPR-friendly but requires proper implementation:

**Privacy Features:**
- Data minimization: Use pseudonymous IDs (UUIDs, not names)
- Purpose limitation: `task.purpose` binds authorization to specific purpose
- Transparency: Audit logs show what agents did
- Right to erasure: Use pseudonymous IDs that can be de-linked

**What to Avoid:**
- Don't put user emails in `task.created_by` (use `user:12345`)
- Don't use stable `audit.trace_id` across domains (rotate at boundaries)
- Don't log tokens in plaintext
- Implement retention policy for audit logs

See Specification Section 13 (Privacy Considerations).

### Q19: Can AAP help with SOC 2 compliance?

**A:** Yes, AAP supports SOC 2 requirements:

**SOC 2 Trust Service Criteria:**

**CC6.1 (Logical Access Controls):**
- AAP provides structured authorization with audit trails

**CC6.2 (Authorization):**
- Capabilities define who can do what
- Constraints limit operational risk
- Oversight requires approval for sensitive actions

**CC7.2 (Monitoring):**
- Audit logs track all agent actions
- Trace IDs enable correlation
- Delegation chains show responsibility

**Implementation:**
- Set `audit.compliance_framework: ["SOC2"]`
- Log all token issuance and validation
- Retain logs for 1 year minimum
- Implement access controls for logs

### Q20: What about HIPAA compliance?

**A:** AAP can be used in HIPAA environments:

**Requirements:**
- **Access Controls:** AAP capabilities control PHI access
- **Audit Logging:** AAP audit claims track PHI access
- **Proof-of-Possession:** REQUIRED for PHI access (prevent token theft)
- **Encryption:** TLS 1.3 for all communications

**BAA Requirements:**
- Covered entities must have BAA with AAP AS provider
- Audit logs must be retained for 6 years
- Breach notification must include AAP audit data

**Recommendation:** Use `data_classification_max: "restricted"` constraint for PHI capabilities.

---

## Migration Questions

### Q21: How long does migration take?

**A:** Typical timeline:

**Small Deployment (<10 APIs, <20 agents):** 2-4 weeks
- Week 1: Setup AS, create policies
- Week 2: Update 1-2 RSs, update agents
- Week 3-4: Expand to all APIs/agents, monitor

**Medium Deployment (10-50 APIs, 20-100 agents):** 4-8 weeks
- Weeks 1-2: Setup, pilot with 1 API + 5 agents
- Weeks 3-6: Expand to 50% of APIs/agents
- Weeks 7-8: Complete migration, deprecate OAuth scopes

**Large Deployment (50+ APIs, 100+ agents):** 3-6 months
- Month 1: Setup, create policies, extensive testing
- Months 2-4: Phased rollout (10% → 50% → 100%)
- Months 5-6: Optimization, deprecation of old system

### Q22: Can I migrate incrementally?

**A:** Yes, recommended approach:

**Parallel Operation:**
- New agents use AAP
- Existing agents continue with OAuth scopes
- RSs validate both token types
- Gradual agent migration over weeks/months

**Dual-Mode RS Example:**
```python
def authorize_request(token, action):
    if is_aap_token(token):
        return validate_aap(token, action)
    else:
        return validate_oauth(token, action)
```

Eventually deprecate OAuth scope support.

### Q23: What if migration fails?

**A:** Rollback plan:

1. **Revert RS to OAuth-only mode**
   - Remove AAP validation code
   - Re-enable OAuth scope validation
2. **Switch agents back to OAuth requests**
   - Update token requests to use `scope` parameter
3. **Investigate root cause**
4. **Fix and retry migration**

**Key:** Run pilot phase (10% traffic) before full migration to catch issues early.

---

## Troubleshooting

### Q24: Why are my tokens rejected with "invalid_token"?

**Common Causes:**

1. **Token Expired:** Check `exp` claim
   ```bash
   jwt decode $TOKEN | jq '.exp, .iat'
   date +%s  # Current time
   ```

2. **Wrong Audience:** Token `aud` doesn't match RS
   ```bash
   jwt decode $TOKEN | jq '.aud'
   echo $AAP_RS_AUDIENCE  # Should match
   ```

3. **Signature Invalid:** Public key mismatch
   ```bash
   # Verify AS public key fingerprint
   openssl ec -pubin -in as_public_key.pem -text
   ```

4. **Missing Required Claims:** Check for `agent`, `task`, `capabilities`
   ```bash
   jwt decode $TOKEN | jq 'keys'
   ```

### Q25: Why are constraint violations not enforced?

**Common Causes:**

1. **Constraint Enforcer Not Initialized**
   - Check RS logs for initialization errors

2. **Redis Unavailable** (if using distributed rate limiting)
   ```bash
   redis-cli -h redis-host ping
   # Should return PONG
   ```

3. **Constraint Format Error**
   - Validate constraints against JSON Schema
   ```bash
   jsonschema -i token.json schemas/aap-constraints.schema.json
   ```

4. **Multiple Capabilities** (OR semantics)
   - If multiple capabilities grant same action, first match is used
   - Check if another capability has looser constraints

### Q26: How do I debug delegation issues?

**Check:**

1. **Delegation Depth:**
   ```bash
   jwt decode $TOKEN | jq '.delegation.depth, .delegation.max_depth'
   # Ensure depth <= max_depth
   ```

2. **Chain Length:**
   ```bash
   jwt decode $TOKEN | jq '.delegation.chain | length'
   # Should equal depth + 1
   ```

3. **Parent Token Valid:**
   - AS should validate parent token before Token Exchange
   - Check AS logs for parent validation errors

4. **Privilege Reduction:**
   ```bash
   # Compare parent and derived tokens
   jwt decode $PARENT_TOKEN | jq '.capabilities'
   jwt decode $DERIVED_TOKEN | jq '.capabilities'
   # Derived should be subset with tighter constraints
   ```

---

## Community and Support

### Q27: Where can I get help?

**Resources:**
- **Specification:** [AAP Complete Specification](/docs/AAP_Complete_Draft_Specification.md)
- **Reference Implementation:** [/reference-impl/](/reference-impl/)
- **GitHub Issues:** [https://github.com/aap-protocol/spec/issues](https://github.com/aap-protocol/spec/issues)
- **IETF Mailing List:** [oauth@ietf.org](mailto:oauth@ietf.org)
- **Slack:** [Join AAP Community](https://aap-protocol.slack.com)

### Q28: How can I contribute?

**Ways to Contribute:**
- **Feedback:** Review spec, file issues for ambiguities
- **Implementations:** Build AAP support in other languages
- **Test Vectors:** Add test cases for edge cases
- **Documentation:** Improve guides, examples, tutorials
- **Advocacy:** Blog posts, conference talks, workshops

See [CONTRIBUTING.md](https://github.com/aap-protocol/spec/blob/main/CONTRIBUTING.md).

### Q29: Is there commercial support available?

**A:** AAP is an open specification. Commercial support options:

- **Reference Implementation:** Community support via GitHub
- **Custom Implementations:** Some vendors offer AAP-compatible products (check vendor documentation)
- **Professional Services:** Consulting firms can help with migration, deployment, custom development

Contact [AAP Working Group](mailto:aap-wg@example.com) for referrals.

### Q30: What's the roadmap?

**Current Status:** Draft-00 submitted to IETF (February 2025)

**Near-Term (Q1-Q2 2025):**
- Community feedback on draft-00
- Reference implementation improvements
- Test vector expansion
- Multi-language implementations (Go, TypeScript, Rust)

**Mid-Term (Q3-Q4 2025):**
- OAuth WG adoption (target)
- Draft-01 with community feedback incorporated
- Commercial implementations
- Certification program

**Long-Term (2026):**
- RFC publication (target)
- Widespread adoption
- Extensions (wildcards in actions, advanced constraints)

---

**Last Updated:** 2025-02-01
**Version:** 1.0
**Feedback:** [Submit FAQ suggestions](https://github.com/aap-protocol/spec/issues)
