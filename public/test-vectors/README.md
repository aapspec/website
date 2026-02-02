# AAP Test Vectors

Comprehensive test vectors for validating AAP (Agent Authorization Profile) implementations.

## Overview

This directory contains test vectors organized by category:
- **valid-tokens/** - Tokens that should pass validation
- **invalid-tokens/** - Tokens that should fail validation with specific errors
- **constraint-violations/** - Scenarios testing constraint enforcement
- **edge-cases/** - Boundary conditions and special cases

## Purpose

Test vectors enable:
1. **Implementation Validation** - Verify your AS/RS correctly implements AAP
2. **Interoperability Testing** - Ensure different implementations work together
3. **Regression Testing** - Catch bugs when updating implementations
4. **Specification Clarification** - Provide concrete examples of abstract rules

## Test Vector Format

Each test vector is a JSON file with the following structure:

```json
{
  "name": "test-vector-name",
  "description": "Human-readable description",
  "token_payload": { /* JWT payload */ },
  "test_cases": [
    {
      "name": "test_case_name",
      "request": { /* Request context */ },
      "expected_result": "AUTHORIZED|FORBIDDEN|REJECTED",
      "error_code": "error_code_if_applicable",
      "description": "What this test validates"
    }
  ],
  "metadata": {
    "specification_section": "Reference to spec section",
    "created": "2025-02-01",
    "version": "1.0"
  }
}
```

## Test Vector Catalog

### Valid Tokens (4 vectors)

| File | Description | Spec Sections Tested |
|------|-------------|---------------------|
| `01-basic-research-agent.json` | Basic agent with web search capability | 7.5, 5.6.2 (Capability, Domain constraints) |
| `02-delegated-token-depth1.json` | First-level delegation with privilege reduction | 5.7, RFC 8693 (Token Exchange) |
| `03-cms-agent-with-oversight.json` | Agent with human approval requirements | 7.6, 5.2 (Oversight) |
| `04-time-window-constrained.json` | Time window and data constraints | 5.6.3, 5.6.5 (Time, Data constraints) |

**Coverage:**
- Basic token validation ✓
- Delegation (depth 0, 1) ✓
- Oversight requirements ✓
- Domain constraints ✓
- Time windows ✓
- HTTP method restrictions ✓
- Request size limits ✓

### Invalid Tokens (6 vectors)

| File | Description | Error Type |
|------|-------------|-----------|
| `01-expired-token.json` | Expired token with clock skew tests | Token expired |
| `02-wrong-audience.json` | Audience mismatch | Invalid audience |
| `03-missing-required-claims.json` | Missing agent/task/capabilities claims (5 variants) | Missing claims |
| `04-excessive-delegation.json` | Delegation depth > max_depth | Excessive delegation |
| `05-invalid-delegation-chain.json` | Malformed delegation chains (3 variants) | Invalid chain |
| `06-invalid-action-format.json` | Action names violating ABNF grammar (5 variants) | Invalid format |

**Coverage:**
- Expiration validation ✓
- Audience validation ✓
- Required claims validation ✓
- Delegation depth enforcement ✓
- Chain structure validation ✓
- Action name format (ABNF) ✓

### Constraint Violations (2 vectors)

| File | Description | Constraints Tested |
|------|-------------|-------------------|
| `01-rate-limit-exceeded.json` | Rate limiting violations (hourly, per-minute) | Rate limits |
| `02-domain-restrictions.json` | Domain allowlist/blocklist violations | Domain constraints |

**Coverage:**
- `max_requests_per_hour` (fixed window) ✓
- `max_requests_per_minute` (sliding window) ✓
- `domains_allowed` (DNS suffix matching) ✓
- `domains_blocked` (precedence) ✓

### Edge Cases (3 vectors)

| File | Description | Edge Conditions |
|------|-------------|----------------|
| `01-clock-skew.json` | Clock skew tolerance (5-minute window) | Time boundaries |
| `02-maximum-delegation-depth.json` | Delegation at max depth | Depth boundaries |
| `03-empty-constraints.json` | Minimal/empty constraints, multiple capabilities | Constraint edge cases |

**Coverage:**
- Clock skew tolerance (±5 minutes) ✓
- Delegation depth boundaries (0, max, max+1) ✓
- Empty constraints handling ✓
- Multiple capabilities (OR semantics) ✓

## Running Test Vectors

### Automated Validation

Use the provided validator script:

```bash
cd test-vectors
python validate_test_vectors.py --all
```

Options:
```bash
# Validate specific category
python validate_test_vectors.py --category valid-tokens

# Validate specific file
python validate_test_vectors.py --file valid-tokens/01-basic-research-agent.json

# Validate against live AS/RS
python validate_test_vectors.py --as http://localhost:8080 --rs http://localhost:8081

# Generate report
python validate_test_vectors.py --all --report report.html
```

### Manual Validation

1. **Sign the token:**
```python
import jwt
import json

with open('valid-tokens/01-basic-research-agent.json') as f:
    vector = json.load(f)

with open('../keys/as_private_key.pem', 'rb') as f:
    private_key = f.read()

token = jwt.encode(
    vector['token_payload'],
    private_key,
    algorithm='ES256',
    headers={'kid': 'aap-as-key-1'}
)
print(token)
```

2. **Validate with RS:**
```python
import requests

response = requests.get(
    'http://localhost:8081/api/search',
    headers={'Authorization': f'Bearer {token}'},
    params={'q': 'test', 'url': 'https://example.org/data'}
)

print(response.status_code, response.json())
```

## Test Coverage Summary

**Total Test Vectors:** 15 files
**Total Test Cases:** 80+ individual tests

### By Specification Section

| Section | Test Vectors | Coverage |
|---------|--------------|----------|
| 5.5 (Action Grammar) | 1 | ABNF validation |
| 5.6.1 (Rate Limits) | 1 | Hourly, per-minute |
| 5.6.2 (Domain Constraints) | 2 | Allowlist, blocklist, DNS matching |
| 5.6.3 (Time Windows) | 1 | Start, end, clock skew |
| 5.6.5 (Data Constraints) | 1 | Methods, size limits |
| 5.7 (Delegation Semantics) | 2 | Depth, chain, privilege reduction |
| 7.1 (Token Validation) | 2 | Signature, expiration, audience |
| 7.3 (Agent Identity) | 1 | Required fields |
| 7.4 (Task Binding) | 1 | Required fields |
| 7.5 (Capability Enforcement) | 4 | Matching, constraints |
| 7.6 (Oversight) | 1 | Approval requirements |
| 7.7 (Delegation Validation) | 3 | Depth, chain validation |
| RFC 8693 (Token Exchange) | 1 | Delegation with reduction |

### By Feature

| Feature | Valid | Invalid | Violations | Edge Cases |
|---------|-------|---------|------------|-----------|
| Basic validation | 4 | 3 | - | - |
| Delegation | 1 | 2 | - | 1 |
| Rate limiting | - | - | 1 | - |
| Domain constraints | 1 | - | 1 | - |
| Time constraints | 1 | - | - | 1 |
| Oversight | 1 | - | - | - |
| Action format | - | 1 | - | - |
| Clock skew | - | 1 | - | 1 |
| Constraints semantics | - | - | - | 1 |

## Using Test Vectors for Interoperability

To test interoperability between different AAP implementations:

1. **Token Issuance Test:**
   - Implementation A (AS) signs test vector token
   - Implementation B (RS) validates the token
   - Compare actual result with `expected_result`

2. **Constraint Enforcement Test:**
   - Use constraint violation test vectors
   - Verify both implementations reject with same error code

3. **Delegation Test:**
   - Implementation A issues parent token
   - Implementation A performs Token Exchange
   - Implementation B validates derived token
   - Verify privilege reduction is correct

## Extending Test Vectors

To add new test vectors:

1. Copy template from existing vector
2. Update `token_payload` with test-specific claims
3. Define `test_cases` with expected results
4. Add `metadata` with spec section references
5. Place in appropriate category directory
6. Update this README catalog
7. Run validator to ensure format is correct

### Test Vector Checklist

- [ ] Unique `name` (no duplicates)
- [ ] Clear `description`
- [ ] Valid JSON structure
- [ ] Conforms to AAP JSON Schema
- [ ] `test_cases` have expected results
- [ ] `metadata.specification_section` references correct sections
- [ ] File named with sequential number (01-, 02-, etc.)

## Validation Requirements

Implementations SHOULD pass all test vectors in `valid-tokens/` and `edge-cases/`.

Implementations MUST correctly reject all test vectors in `invalid-tokens/` and `constraint-violations/` with the specified error codes.

## License

Test vectors are part of the AAP reference implementation. See main project LICENSE.

## See Also

- [AAP Specification](/docs/AAP_Complete_Draft_Specification.md)
- [JSON Schemas](/schemas/)
- [Reference Implementation](/reference-impl/)
