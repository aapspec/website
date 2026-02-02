# AAP Migration Guide: From OAuth Scopes to AAP Capabilities

## Overview

This guide helps organizations migrate from traditional OAuth 2.0 scope-based authorization to the Agent Authorization Profile (AAP) with structured capabilities.

**Target Audience:** Organizations currently using OAuth 2.0 for API authorization who want to adopt AAP for AI agent scenarios.

**Migration Complexity:** Medium (requires policy definition and token structure changes, but maintains OAuth 2.0 foundation)

**Estimated Timeline:** 2-6 weeks depending on number of APIs and agents

---

## Why Migrate?

### Limitations of OAuth Scopes for AI Agents

| Problem | OAuth Scopes | AAP Capabilities |
|---------|--------------|------------------|
| **Granularity** | Coarse (e.g., `read:articles`) | Fine-grained (`cms.read_articles` with domain/rate constraints) |
| **Constraints** | Not supported | Built-in (rate limits, domains, time windows) |
| **Task Binding** | No context | Explicit task purpose |
| **Delegation** | No tracking | Full chain with depth limits |
| **Oversight** | External system | Native approval requirements |
| **Audit** | Add-on | Integrated trace IDs |

### When to Migrate

✅ **Good fit for AAP:**
- Autonomous AI agents accessing APIs
- High-volume or high-risk agent operations
- Multi-agent workflows with delegation
- Regulatory compliance requirements (SOC2, GDPR, HIPAA)
- Need for purpose-bound authorization
- Human oversight requirements for sensitive actions

❌ **OAuth Scopes may be sufficient:**
- Traditional user-to-app-to-API flows
- Low-risk, internal-only APIs
- Simple authorization requirements
- No autonomous agent operations

---

## Migration Strategies

### Strategy 1: Phased Migration (RECOMMENDED)

Migrate incrementally, one API or agent type at a time.

**Phases:**
1. **Phase 1 (Pilot):** Single API, single agent type
2. **Phase 2 (Expansion):** Additional APIs, more agent types
3. **Phase 3 (Full Migration):** All APIs and agents
4. **Phase 4 (Deprecation):** Remove OAuth scope support

**Timeline:** 4-6 weeks
**Risk:** Low (incremental, easy rollback)

### Strategy 2: Parallel Operation

Run OAuth scopes and AAP capabilities side-by-side.

**Approach:**
- New agents use AAP
- Existing agents continue with OAuth scopes
- Resource Servers accept both token types
- Gradual agent migration

**Timeline:** 2-4 weeks initial setup, 6-12 months full transition
**Risk:** Low (no disruption)

### Strategy 3: Big Bang Migration

Migrate all agents and APIs simultaneously.

**Approach:**
- Deploy AS and update all RSs at once
- All agents updated to request AAP tokens
- No backwards compatibility

**Timeline:** 2-3 weeks
**Risk:** High (requires extensive testing, coordination)

**Recommendation:** Only for small deployments or greenfield projects.

---

## Step-by-Step Migration

### Step 1: Scope Inventory and Mapping

**Goal:** Document current OAuth scopes and map to AAP capabilities.

#### 1.1 List All OAuth Scopes

Example current scopes:
```
read:articles
write:articles
publish:articles
search:web
execute:payments
```

#### 1.2 Map Scopes to AAP Capabilities

| OAuth Scope | AAP Capability | Constraints | Notes |
|-------------|----------------|-------------|-------|
| `read:articles` | `cms.read_articles` | `max_requests_per_hour: 1000` | Read-only, high volume OK |
| `write:articles` | `cms.create_draft` | `max_requests_per_hour: 100` | Split write into draft/publish |
| `publish:articles` | `cms.publish` | `requires_human_approval_for: ["cms.publish"]` | Requires approval |
| `search:web` | `search.web` | `domains_allowed: ["example.org"], max_requests_per_hour: 50` | Add domain restrictions |
| `execute:payments` | `payment.execute` | `require_approval_threshold: 1000, requires_human_approval_for: ["payment.execute"]` | Always require approval |

**Key Decisions:**
- **Granularity:** Split broad scopes (e.g., `write:articles` → `cms.create_draft` + `cms.publish`)
- **Constraints:** Add appropriate limits (rate, domain, time)
- **Oversight:** Identify actions requiring human approval

#### 1.3 Define Action Naming Convention

Recommended format: `<service>.<operation>`

Examples:
- `cms.read_articles`
- `cms.create_draft`
- `cms.publish`
- `search.web`
- `payment.execute`
- `data.analyze`

**Guidelines:**
- Use lowercase with underscores or hyphens
- Group by service/domain
- Use verb for operation (read, create, update, delete, execute, analyze, search)
- Keep concise (2-3 components)

### Step 2: Create Operator Policies

**Goal:** Define authorization policies for each agent operator.

#### 2.1 Identify Operators

List organizations/teams operating agents:
- `org:engineering`
- `org:content-team`
- `org:customer-success`

#### 2.2 Create Policy Files

Example policy for content team:

**File:** `policies/org-content-team.json`

```json
{
  "policy_id": "policy-content-team-v1",
  "policy_version": "1.0",
  "applies_to": {
    "operator": "org:content-team"
  },
  "allowed_capabilities": [
    {
      "action": "cms.read_articles",
      "description": "Read published articles",
      "default_constraints": {
        "max_requests_per_hour": 500
      }
    },
    {
      "action": "cms.create_draft",
      "description": "Create draft articles",
      "default_constraints": {
        "max_requests_per_hour": 50
      }
    },
    {
      "action": "cms.update_draft",
      "description": "Update draft articles",
      "default_constraints": {
        "max_requests_per_hour": 100
      }
    },
    {
      "action": "cms.publish",
      "description": "Publish articles (requires approval)",
      "requires_oversight": true
    }
  ],
  "global_constraints": {
    "token_lifetime": 3600,
    "max_delegation_depth": 1
  },
  "oversight": {
    "level": "approval",
    "requires_human_approval_for": ["cms.publish"],
    "approval_reference": "https://approval.example.com/content-team"
  },
  "audit": {
    "log_level": "full",
    "retention_period_days": 90,
    "compliance_framework": ["SOC2"]
  }
}
```

#### 2.3 Policy Validation

Use JSON Schema to validate policies:

```bash
jsonschema -i policies/org-content-team.json schemas/policy.schema.json
```

### Step 3: Deploy Authorization Server

**Goal:** Set up AAP-compliant Authorization Server.

#### 3.1 Choose Deployment Option

**Option A: Reference Implementation**
- Use AAP reference AS (Python/Flask)
- Good for: Proof-of-concept, small deployments
- Setup time: 1-2 days

**Option B: Extend Existing AS**
- Modify existing OAuth AS to issue AAP claims
- Good for: Organizations with custom AS
- Setup time: 1-2 weeks

**Option C: Commercial Solution**
- Use AAP-compatible commercial AS (when available)
- Good for: Large deployments, support requirements
- Setup time: Varies

#### 3.2 Deploy Reference AS (Example)

```bash
# Clone reference implementation
git clone https://github.com/aap-protocol/reference-impl.git
cd reference-impl

# Install dependencies
pip install -r requirements.txt

# Generate keys
cd scripts
./generate_keys.sh
cd ..

# Copy policies
cp /your/policies/* policies/

# Configure
export AAP_ISSUER=https://as.yourcompany.com
export AAP_AS_PORT=8080

# Run AS
cd as
python server.py
```

#### 3.3 Test AS

```bash
# Request token
curl -X POST http://localhost:8080/token \
  -d "grant_type=client_credentials" \
  -d "client_id=test-agent" \
  -d "client_secret=secret" \
  -d "operator=org:content-team" \
  -d "task_id=task-test-001" \
  -d "task_purpose=test_migration" \
  -d "capabilities=cms.read_articles" \
  -d "audience=https://api.example.com"

# Decode token to verify AAP claims
# (Use jwt.io or PyJWT)
```

### Step 4: Update Resource Servers

**Goal:** Enable RSs to validate AAP tokens.

#### 4.1 Integration Approach

**Option A: AAP-Only**
- RS validates only AAP tokens
- Fastest migration
- Requires all agents updated

**Option B: Dual-Mode**
- RS validates both OAuth scopes and AAP capabilities
- Gradual migration
- More complex validation logic

#### 4.2 Add AAP Validation Logic

**Python/Flask Example:**

```python
from rs.validator import TokenValidator
from rs.capability_matcher import CapabilityMatcher
from rs.constraint_enforcer import ConstraintEnforcer

# Initialize components
with open('as_public_key.pem', 'rb') as f:
    public_key = f.read()

validator = TokenValidator(
    public_key=public_key,
    audience="https://api.example.com",
    trusted_issuers=["https://as.yourcompany.com"]
)

matcher = CapabilityMatcher()
enforcer = ConstraintEnforcer()

@app.route('/api/cms/articles', methods=['GET'])
def get_articles():
    # Extract token
    token = request.headers.get('Authorization', '').replace('Bearer ', '')

    # Validate token
    payload = validator.validate(token)

    # Match capability
    capability = matcher.find_matching_capability(
        payload['capabilities'],
        'cms.read_articles'
    )
    if not capability:
        return {'error': 'aap_invalid_capability'}, 403

    # Enforce constraints
    enforcer.enforce_constraints(
        capability['constraints'],
        {'action': 'cms.read_articles', 'method': 'GET'},
        payload['jti']
    )

    # If authorized, execute action
    articles = fetch_articles()
    return {'articles': articles}
```

#### 4.3 Dual-Mode RS (OAuth + AAP)

```python
def authorize_request(token, action):
    # Try AAP validation first
    try:
        payload = validate_aap_token(token)
        enforce_aap_capability(payload, action)
        return payload
    except AAPValidationError:
        pass

    # Fallback to OAuth scope validation
    try:
        payload = validate_oauth_token(token)
        scope = map_action_to_scope(action)
        enforce_oauth_scope(payload, scope)
        return payload
    except OAuthValidationError as e:
        raise Unauthorized(str(e))
```

### Step 5: Update Agent Clients

**Goal:** Agents request AAP tokens instead of OAuth scope tokens.

#### 5.1 Update Token Request

**Before (OAuth Scopes):**

```python
import requests

response = requests.post(
    'https://as.example.com/token',
    data={
        'grant_type': 'client_credentials',
        'client_id': 'content-agent-01',
        'client_secret': 'secret',
        'scope': 'read:articles write:articles'
    }
)

token = response.json()['access_token']
```

**After (AAP Capabilities):**

```python
import requests

response = requests.post(
    'https://as.yourcompany.com/token',
    data={
        'grant_type': 'client_credentials',
        'client_id': 'content-agent-01',
        'client_secret': 'secret',
        'operator': 'org:content-team',
        'task_id': 'task-create-article-001',
        'task_purpose': 'create_blog_post_about_product_launch',
        'capabilities': 'cms.create_draft,cms.update_draft',
        'audience': 'https://api.example.com'
    }
)

token = response.json()['access_token']
```

**Key Changes:**
- Add `operator` (organization operating the agent)
- Add `task_id` (unique task identifier)
- Add `task_purpose` (human-readable purpose)
- Replace `scope` with `capabilities` (comma-separated actions)
- Add `audience` (specific RS)

#### 5.2 Handle Token Exchange (Delegation)

If agent delegates to tools:

```python
# Agent delegates to scraper tool
response = requests.post(
    'https://as.yourcompany.com/token',
    data={
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'subject_token': parent_token,
        'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
        'resource': 'https://tool-scraper.example.com',
        'scope': 'search.web'  # Subset of parent capabilities
    }
)

derived_token = response.json()['access_token']
```

### Step 6: Testing and Validation

**Goal:** Ensure migration is successful before full deployment.

#### 6.1 Unit Testing

Test AS policy enforcement:

```python
def test_capability_grant():
    policy = load_policy('org:content-team')
    capabilities = policy.evaluate_capabilities(
        operator='org:content-team',
        requested_capabilities=['cms.create_draft']
    )
    assert len(capabilities) == 1
    assert capabilities[0].action == 'cms.create_draft'
```

Test RS constraint enforcement:

```python
def test_rate_limit_enforcement():
    enforcer = ConstraintEnforcer()

    # 50 requests should succeed
    for i in range(50):
        enforcer.enforce_constraints(
            {'max_requests_per_hour': 50},
            {'action': 'test'},
            'token-001'
        )

    # 51st request should fail
    with pytest.raises(ConstraintViolationError):
        enforcer.enforce_constraints(
            {'max_requests_per_hour': 50},
            {'action': 'test'},
            'token-001'
        )
```

#### 6.2 Integration Testing

End-to-end flow:

```python
def test_end_to_end_flow():
    # 1. Agent requests token
    token_response = requests.post(
        AS_URL + '/token',
        data={
            'grant_type': 'client_credentials',
            'client_id': 'test-agent',
            'client_secret': 'secret',
            'operator': 'org:content-team',
            'task_id': 'task-test-001',
            'task_purpose': 'test',
            'capabilities': 'cms.read_articles',
            'audience': RS_URL
        }
    )
    assert token_response.status_code == 200
    token = token_response.json()['access_token']

    # 2. Agent uses token to access RS
    api_response = requests.get(
        RS_URL + '/api/cms/articles',
        headers={'Authorization': f'Bearer {token}'}
    )
    assert api_response.status_code == 200
```

#### 6.3 Load Testing

Test with production-like load:

```bash
# Using Apache Bench
ab -n 10000 -c 100 -H "Authorization: Bearer $TOKEN" \
   https://api.example.com/api/cms/articles
```

Monitor:
- Token validation latency
- Constraint enforcement performance
- Rate limiting accuracy
- Memory usage

### Step 7: Rollout and Monitoring

**Goal:** Deploy to production safely.

#### 7.1 Rollout Plan

**Week 1-2: Pilot (10% traffic)**
- Deploy to staging
- Migrate 1-2 low-risk agents
- Monitor metrics

**Week 3-4: Expansion (50% traffic)**
- Migrate additional agents
- Monitor error rates
- Tune policies based on learnings

**Week 5-6: Full Migration (100% traffic)**
- Migrate remaining agents
- Remove OAuth scope code paths (if AAP-only)
- Update documentation

#### 7.2 Monitoring

Key metrics to track:

**Authorization Server:**
- Token issuance rate
- Token Exchange rate (delegation)
- Policy evaluation latency
- Error rate by type

**Resource Server:**
- Validation latency
- Constraint violation rate (by type)
- Authorization success/failure rate
- False positives (legitimate requests denied)

**Alerting:**
- Token validation failure rate > 5%
- Constraint violation rate spike (>2x baseline)
- AS unavailable
- Policy evaluation errors

#### 7.3 Rollback Plan

If issues occur:

1. **Revert RS to dual-mode** (OAuth + AAP)
2. **Switch agents back to OAuth scope requests**
3. **Investigate root cause**
4. **Fix and re-deploy**

---

## Common Migration Challenges

### Challenge 1: Overly Broad Scopes

**Problem:** Current scope `admin:all` grants too much.

**Solution:** Break down into fine-grained capabilities:
- `admin:all` → `users.read`, `users.create`, `users.update`, `users.delete`, `config.read`, `config.update`

Add constraints per capability (different rate limits for read vs. write).

### Challenge 2: Implicit Task Context

**Problem:** OAuth doesn't track task purpose; agents do many tasks.

**Solution:**
- Generate unique `task_id` per agent task
- Capture task purpose from agent's workflow context
- Example: Email agent task = `task_id: email-123`, `task_purpose: send_welcome_email_to_new_users`

### Challenge 3: Delegation Not Tracked

**Problem:** Agent delegates to tools but no audit trail.

**Solution:**
- Use AAP Token Exchange for all delegation
- Delegation chain automatically tracked
- Set `max_delegation_depth` based on risk (typically 1-3)

### Challenge 4: No Rate Limiting

**Problem:** OAuth scopes have no built-in rate limiting.

**Solution:**
- Add `max_requests_per_hour` / `max_requests_per_minute` to all capabilities
- Start conservative, tune based on monitoring
- Different limits for different risk levels (read vs. write)

### Challenge 5: Backwards Compatibility

**Problem:** Can't update all agents simultaneously.

**Solution:**
- Run RS in dual-mode (OAuth + AAP)
- New agents use AAP, existing use OAuth
- Gradual migration over weeks/months
- Eventually deprecate OAuth scopes

---

## Migration Checklist

### Pre-Migration

- [ ] Inventory all current OAuth scopes
- [ ] Map scopes to AAP capabilities
- [ ] Define action naming convention
- [ ] Identify agent operators
- [ ] Create operator policies
- [ ] Choose migration strategy

### Deployment

- [ ] Deploy Authorization Server
- [ ] Generate and secure signing keys
- [ ] Load operator policies
- [ ] Test AS token issuance
- [ ] Update Resource Servers with AAP validation
- [ ] Test RS constraint enforcement
- [ ] Update agent clients to request AAP tokens

### Testing

- [ ] Unit test policy engine
- [ ] Unit test constraint enforcement
- [ ] Integration test end-to-end flow
- [ ] Load test with production-like traffic
- [ ] Validate test vectors pass

### Production

- [ ] Deploy to staging
- [ ] Pilot with 10% traffic
- [ ] Monitor metrics and errors
- [ ] Expand to 50% traffic
- [ ] Full rollout to 100%
- [ ] Update documentation
- [ ] Train team on AAP concepts

### Post-Migration

- [ ] Remove OAuth scope code (if AAP-only)
- [ ] Archive old policies
- [ ] Review and tune constraints based on usage
- [ ] Update audit/compliance documentation

---

## FAQ

**Q: Can we use AAP and OAuth scopes together?**
A: Yes, Resource Servers can validate both token types during transition.

**Q: How long does migration take?**
A: 2-6 weeks depending on number of APIs, agents, and chosen strategy.

**Q: Do we need to update all agents at once?**
A: No, use phased or parallel migration to update incrementally.

**Q: What if an agent needs capabilities from multiple operators?**
A: Create a shared operator policy or use token exchange between operator domains.

**Q: How do we handle human approval workflows?**
A: Use AAP `oversight` claim; implement approval API separately.

**Q: Can AAP work with our existing OAuth AS?**
A: Yes, extend your AS to issue AAP claims alongside standard OAuth claims.

---

## Next Steps

1. **Review Specification:** Read [AAP Complete Specification](/docs/AAP_Complete_Draft_Specification.md)
2. **Try Reference Implementation:** Deploy [Reference AS and RS](/reference-impl/)
3. **Run Test Vectors:** Validate with [Test Vectors](/test-vectors/)
4. **Review Examples:** See [End-to-End Examples](/examples/)
5. **Deploy to Staging:** Start pilot migration

---

**Document Version:** 1.0
**Last Updated:** 2025-02-01
**Maintainer:** AAP Implementation Team
