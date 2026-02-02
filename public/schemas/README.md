# AAP JSON Schemas

This directory contains formal JSON Schema definitions for the Agent Authorization Profile (AAP) token structure.

## Overview

These schemas provide machine-readable, formal specifications for validating AAP JWT token payloads. They eliminate ambiguities in the specification and enable automatic validation of tokens.

## Schema Files

### Core Token Schema
- **aap-token.schema.json** - Complete schema for AAP JWT payload
  - Validates all required and optional claims
  - References all component schemas below

### Component Schemas
- **aap-agent.schema.json** - Agent identity claim (`agent`)
- **aap-task.schema.json** - Task binding claim (`task`)
- **aap-capabilities.schema.json** - Capabilities array (`capabilities`)
- **aap-constraints.schema.json** - Constraint objects within capabilities
- **aap-oversight.schema.json** - Human oversight requirements (`oversight`)
- **aap-delegation.schema.json** - Delegation chain tracking (`delegation`)
- **aap-context.schema.json** - Execution context (`context`)
- **aap-audit.schema.json** - Audit and logging requirements (`audit`)

## Usage

### Validation with JSON Schema

```javascript
// Node.js example using ajv
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

// Load schemas
const tokenSchema = require('./aap-token.schema.json');
const agentSchema = require('./aap-agent.schema.json');
// ... load other schemas

// Add schemas to validator
ajv.addSchema(agentSchema);
ajv.addSchema(taskSchema);
// ... add other schemas

// Validate a token
const validate = ajv.compile(tokenSchema);
const valid = validate(tokenPayload);

if (!valid) {
  console.error('Token validation errors:', validate.errors);
}
```

```python
# Python example using jsonschema
import jsonschema
import json

# Load schemas
with open('aap-token.schema.json') as f:
    token_schema = json.load(f)

# Load referenced schemas
with open('aap-agent.schema.json') as f:
    agent_schema = json.load(f)
# ... load other schemas

# Create resolver for $ref
resolver = jsonschema.RefResolver.from_schema(
    token_schema,
    store={
        'aap-agent.schema.json': agent_schema,
        # ... add other schemas
    }
)

# Validate token
try:
    jsonschema.validate(
        instance=token_payload,
        schema=token_schema,
        resolver=resolver
    )
    print("Token is valid")
except jsonschema.ValidationError as e:
    print(f"Validation error: {e.message}")
```

## Schema Standards

All schemas follow:
- **JSON Schema version**: Draft 2020-12
- **Schema IDs**: Use `https://aap-protocol.org/schemas/` namespace
- **Format validation**: Uses standard JSON Schema formats (uri, hostname, date-time, etc.)
- **Additional properties**: Controlled per schema (some allow extensions, others are strict)

## Key Design Decisions

### Action Name Pattern
Action names follow ABNF grammar:
```abnf
action-name = component *( "." component )
component = ALPHA *( ALPHA / DIGIT / "-" / "_" )
```

Validated by regex: `^[a-zA-Z][a-zA-Z0-9_-]*(\\.[a-zA-Z][a-zA-Z0-9_-]*)*$`

### Constraint Semantics

| Constraint | Type | Semantics |
|-----------|------|-----------|
| `max_requests_per_hour` | integer | Fixed hourly window, resets at minute 0 |
| `max_requests_per_minute` | integer | Sliding 60-second window |
| `domains_allowed` | array[string] | DNS suffix matching (rightmost) |
| `time_window` | object | Inclusive start, exclusive end (ISO 8601) |
| `max_depth` | integer | Maximum delegation depth (0-10) |

### Multiple Constraints
- Multiple capabilities with same action: **OR** semantics (any matching capability allows)
- Multiple constraints within capability: **AND** semantics (all must pass)

## Validation Tools

### Online Validator
Visit https://aap-protocol.org/validator to validate tokens against these schemas in your browser.

### CLI Validator
```bash
# Using ajv-cli
npx ajv validate -s schemas/aap-token.schema.json -d token.json --spec=draft2020

# Using Python
python -m jsonschema schemas/aap-token.schema.json -i token.json
```

## Contributing

When modifying schemas:
1. Update the schema version date in the description
2. Add examples for new properties
3. Update this README with semantic changes
4. Run validation tests against test-vectors/
5. Update the main specification document to match

## References

- [JSON Schema Specification](https://json-schema.org/)
- [AAP Complete Specification](../docs/AAP_Complete_Draft_Specification.md)
- [Test Vectors](../test-vectors/)
- [Reference Implementation](../reference-impl/)
