/**
 * Schema validator using Ajv for AAP tokens
 */

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { ValidationResult } from './types';

// Re-export ValidationResult for consumers
export type { ValidationResult };

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  validateFormats: true
});
addFormats(ajv);

let schemasInitialized = false;

export function initializeSchemas(schemas: Record<string, object>) {
  if (schemasInitialized) {
    return;
  }

  if (!schemas || Object.keys(schemas).length === 0) {
    console.error('No schemas provided to initializeSchemas');
    return;
  }

  // Define load order: dependencies first, then schemas that reference them
  const loadOrder = [
    'aap-constraints.schema.json',
    'aap-agent.schema.json',
    'aap-task.schema.json',
    'aap-capabilities.schema.json',
    'aap-oversight.schema.json',
    'aap-delegation.schema.json',
    'aap-context.schema.json',
    'aap-audit.schema.json',
    'aap-token.schema.json'
  ];

  // First pass: Add all schemas
  loadOrder.forEach(filename => {
    if (schemas[filename]) {
      try {
        const schema = schemas[filename] as Record<string, unknown>;
        const schemaForAjv = { ...schema };
        delete schemaForAjv.$id;
        ajv.addSchema(schemaForAjv, filename);
      } catch (error) {
        console.error(`Failed to add schema ${filename}:`, error);
      }
    }
  });

  // Second pass: Verify the main schema compiles
  try {
    const tokenSchema = ajv.getSchema('aap-token.schema.json');
    if (!tokenSchema && schemas['aap-token.schema.json']) {
      ajv.compile(schemas['aap-token.schema.json']);
    }
  } catch (error) {
    console.error('Failed to verify token schema:', error);
  }

  // Load any remaining schemas not in the load order
  Object.entries(schemas).forEach(([filename, schema]) => {
    if (!loadOrder.includes(filename)) {
      try {
        ajv.addSchema(schema, filename);
      } catch (error) {
        console.error(`Failed to add schema ${filename}:`, error);
      }
    }
  });

  schemasInitialized = true;
}

function formatAjvError(error: ErrorObject): { message: string; path?: string } {
  const path = error.instancePath || error.schemaPath;
  let message = error.message || 'Validation error';

  if (error.keyword === 'required') {
    message = `Missing required field: ${error.params.missingProperty}`;
  } else if (error.keyword === 'type') {
    message = `Invalid type: expected ${error.params.type}`;
  } else if (error.keyword === 'format') {
    message = `Invalid format: ${error.params.format}`;
  } else if (error.keyword === 'enum') {
    message = `Invalid value: must be one of ${error.params.allowedValues?.join(', ')}`;
  } else if (error.keyword === 'minimum' || error.keyword === 'maximum') {
    message = `Value must be ${error.keyword} ${error.params.limit}`;
  } else if (error.keyword === 'minLength') {
    const field = path.split('/').pop() || 'field';
    message = `${field}: cannot be empty`;
  } else if (error.keyword === 'minItems') {
    const field = path.split('/').pop() || 'array';
    message = `${field}: must have at least ${error.params.limit} item(s)`;
  }

  return {
    message,
    path: path || undefined
  };
}

export function validateTokenPayload(payload: object): ValidationResult {
  if (!schemasInitialized) {
    return {
      valid: false,
      errors: [{ message: 'Schemas not initialized. Call initializeSchemas first.' }]
    };
  }

  const validate = ajv.getSchema('aap-token.schema.json');

  if (!validate) {
    return {
      valid: false,
      errors: [{ message: 'Token schema not found' }]
    };
  }

  const valid = validate(payload);

  return {
    valid: valid === true,
    errors: valid ? [] : (validate.errors || []).map(formatAjvError)
  };
}

export function validateAgentClaim(agent: object): ValidationResult {
  const validate = ajv.getSchema('aap-agent.schema.json');
  if (!validate) {
    return { valid: false, errors: [{ message: 'Agent schema not found' }] };
  }

  const valid = validate(agent);
  return {
    valid: valid === true,
    errors: valid ? [] : (validate.errors || []).map(formatAjvError)
  };
}

export function validateTaskClaim(task: object): ValidationResult {
  const validate = ajv.getSchema('aap-task.schema.json');
  if (!validate) {
    return { valid: false, errors: [{ message: 'Task schema not found' }] };
  }

  const valid = validate(task);
  return {
    valid: valid === true,
    errors: valid ? [] : (validate.errors || []).map(formatAjvError)
  };
}

export function validateCapabilitiesClaim(capabilities: object): ValidationResult {
  const validate = ajv.getSchema('aap-capabilities.schema.json');
  if (!validate) {
    return { valid: false, errors: [{ message: 'Capabilities schema not found' }] };
  }

  const valid = validate(capabilities);
  return {
    valid: valid === true,
    errors: valid ? [] : (validate.errors || []).map(formatAjvError)
  };
}
