/**
 * TypeScript types for AAP Token Generator
 */

export interface TokenPayload {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nbf?: number;
  jti?: string;
  scope?: string;
  agent: AgentClaim;
  task: TaskClaim;
  capabilities: CapabilityClaim[];
  oversight?: OversightClaim;
  delegation?: DelegationClaim;
  context?: ContextClaim;
  audit?: AuditClaim;
  cnf?: ConfirmationClaim;
}

export interface AgentClaim {
  id: string;
  type: 'llm-autonomous' | 'software' | 'model-based' | 'hybrid' | 'rpa-bot';
  operator: string;
  name?: string;
  version?: string;
  model?: string;
  description?: string;
  capabilities_uri?: string;
}

export interface TaskClaim {
  id: string;
  purpose: string;
  created_by?: string;
  created_at?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  expires_at?: number;
  input_context?: string;
  expected_output?: string;
}

export interface CapabilityClaim {
  action: string;
  description?: string;
  constraints?: ConstraintsClaim;
  resources?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConstraintsClaim {
  max_requests_per_hour?: number;
  max_requests_per_minute?: number;
  max_requests_per_day?: number;
  max_cost_usd?: number;
  max_tokens_per_request?: number;
  max_file_size_mb?: number;
  domains_allowed?: string[];
  domains_blocked?: string[];
  time_window?: { start: string; end: string };
  allowed_methods?: string[];
  rate_limit?: { requests: number; period: string };
  geographic_restrictions?: {
    allowed_countries?: string[];
    blocked_countries?: string[];
  };
}

export interface OversightClaim {
  required: boolean;
  mode?: 'pre_approval' | 'notification' | 'audit_only';
  actions_requiring_approval?: string[];
  notification_endpoint?: string;
  approval_timeout_seconds?: number;
}

export interface DelegationClaim {
  delegator_id: string;
  delegator_type?: string;
  delegation_time: number;
  depth: number;
  max_depth?: number;
  original_principal?: string;
  delegation_chain?: string[];
}

export interface ContextClaim {
  session_id?: string;
  user_id?: string;
  correlation_id?: string;
  environment?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditClaim {
  log_endpoint?: string;
  log_level?: 'debug' | 'info' | 'warning' | 'error';
  required_fields?: string[];
  retention_days?: number;
}

export interface ConfirmationClaim {
  jkt?: string;
  kid?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ message: string; path?: string }>;
}
