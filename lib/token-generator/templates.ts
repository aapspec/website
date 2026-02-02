/**
 * Pre-configured templates for AAP token generation
 */

import { TokenPayload } from './types';

export interface Template {
  name: string;
  description: string;
  payload: TokenPayload;
}

// Helper function to get current timestamps (called client-side)
export function getTimestamps() {
  const now = Math.floor(Date.now() / 1000);
  return {
    now,
    oneHourLater: now + 3600
  };
}

// Use static timestamps for SSR compatibility
// These will be updated on the client side when templates are loaded
const STATIC_IAT = 1735686000; // Example: 2025-01-01 00:00:00 UTC
const STATIC_EXP = 1735689600; // Example: 2025-01-01 01:00:00 UTC

export const templates: Record<string, Template> = {
  blank: {
    name: 'Blank Template',
    description: 'Start from scratch with minimal required fields',
    payload: {
      iss: 'https://as.example.com',
      sub: 'agent-001',
      aud: 'https://api.example.com',
      exp: STATIC_EXP,
      iat: STATIC_IAT,
      agent: {
        id: 'agent-001',
        type: 'llm-autonomous',
        operator: 'org:example'
      },
      task: {
        id: 'task-001',
        purpose: 'general_purpose'
      },
      capabilities: [
        {
          action: 'api.read',
          description: 'Read access to API resources'
        }
      ]
    }
  },

  'research-agent': {
    name: 'Research Agent',
    description: 'Basic research agent with web search capability',
    payload: {
      iss: 'https://as.example.com',
      sub: 'agent-researcher-01',
      aud: 'https://api.example.com',
      exp: STATIC_EXP,
      iat: STATIC_IAT,
      jti: '550e8400-e29b-41d4-a716-446655440000',
      agent: {
        id: 'agent-researcher-01',
        type: 'llm-autonomous',
        operator: 'org:acme-corp',
        name: 'Research Assistant',
        version: '1.0.0'
      },
      task: {
        id: 'task-research-001',
        purpose: 'research_climate_data',
        created_at: STATIC_IAT,
        created_by: 'user:alice',
        category: 'research'
      },
      capabilities: [
        {
          action: 'search.web',
          description: 'Search web resources within allowed domains',
          constraints: {
            domains_allowed: ['example.org', 'trusted.com'],
            max_requests_per_hour: 100,
            max_requests_per_minute: 10
          }
        }
      ]
    }
  },

  delegated: {
    name: 'Delegated Token',
    description: 'First-level delegated token with reduced privileges',
    payload: {
      iss: 'https://as.example.com',
      sub: 'agent-researcher-01',
      aud: 'https://tool-scraper.example.com',
      exp: STATIC_EXP,
      iat: STATIC_IAT,
      jti: '550e8400-e29b-41d4-a716-446655440002',
      agent: {
        id: 'agent-researcher-01',
        type: 'llm-autonomous',
        operator: 'org:acme-corp',
        name: 'Research Assistant',
        version: '1.0.0'
      },
      task: {
        id: 'task-research-001',
        purpose: 'research_climate_data',
        created_at: STATIC_IAT,
        created_by: 'user:alice',
        category: 'research'
      },
      capabilities: [
        {
          action: 'search.web',
          description: 'Search web resources within allowed domains',
          constraints: {
            domains_allowed: ['example.org'],
            max_requests_per_hour: 50,
            max_requests_per_minute: 5
          }
        }
      ],
      delegation: {
        delegator_id: 'agent-researcher-01',
        delegation_time: STATIC_IAT,
        depth: 1,
        max_depth: 2,
        delegation_chain: ['agent-researcher-01', 'tool-scraper']
      }
    }
  },

  'cms-agent': {
    name: 'CMS Agent with Oversight',
    description: 'Content management agent requiring human approval',
    payload: {
      iss: 'https://as.example.com',
      sub: 'agent-cms-01',
      aud: 'https://cms.example.com',
      exp: STATIC_EXP,
      iat: STATIC_IAT,
      agent: {
        id: 'agent-cms-01',
        type: 'software',
        operator: 'org:acme-corp',
        name: 'CMS Publishing Agent',
        version: '2.0.0'
      },
      task: {
        id: 'task-cms-publish-001',
        purpose: 'publish_article',
        priority: 'high',
        category: 'content-management'
      },
      capabilities: [
        {
          action: 'cms.read',
          description: 'Read articles and drafts'
        },
        {
          action: 'cms.draft',
          description: 'Create and update drafts'
        },
        {
          action: 'cms.publish',
          description: 'Publish articles (requires approval)',
          constraints: {
            max_requests_per_hour: 10
          }
        }
      ],
      oversight: {
        required: true,
        mode: 'pre_approval',
        actions_requiring_approval: ['cms.publish']
      }
    }
  },

  'time-constrained': {
    name: 'Time-Constrained Agent',
    description: 'Agent with time window restrictions',
    payload: {
      iss: 'https://as.example.com',
      sub: 'agent-backup-01',
      aud: 'https://storage.example.com',
      exp: STATIC_EXP,
      iat: STATIC_IAT,
      agent: {
        id: 'agent-backup-01',
        type: 'software',
        operator: 'org:acme-corp',
        name: 'Backup Agent',
        version: '1.0.0'
      },
      task: {
        id: 'task-backup-001',
        purpose: 'nightly_backup',
        priority: 'medium',
        category: 'operations'
      },
      capabilities: [
        {
          action: 'storage.write',
          description: 'Write backup files during maintenance window',
          constraints: {
            time_window: {
              start: '22:00:00Z',
              end: '06:00:00Z'
            },
            max_file_size_mb: 1000,
            domains_allowed: ['backup.example.com']
          }
        }
      ]
    }
  }
};

export function getTemplateNames(): string[] {
  return Object.keys(templates);
}

export function getTemplate(key: string): Template | undefined {
  return templates[key];
}
