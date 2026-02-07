export const landingContent = {
  metadata: {
    title: 'Agent Authorization Profile (AAP) for OAuth 2.0',
    description: 'OAuth 2.0 profile for AI agents with enforceable rate limits, domain restrictions, delegation depth control, task binding, and human oversight—in standard JWT tokens.',
    ogImage: '/og-image.png',
  },
  hero: {
    badge: 'OAuth 2.0 for the AI Agent Era',
    title: 'Agent Authorization Profile (AAP) for OAuth 2.0',
    subtitle: 'Rate limits, domain restrictions, and delegation depth—right in your OAuth tokens',
    description: 'Stop building custom authorization middleware for every agent. AAP gives you structured JWT claims for capabilities (with constraints), task binding, delegation tracking, and oversight requirements. Works with any OAuth 2.0 Authorization Server.',
    primaryCta: { text: 'Read the Specification', href: '/specification' },
    secondaryCta: { text: 'See a Complete Token', href: '#code-example' },
  },
  problem: {
    title: 'Why AAP?',
    subtitle: 'OAuth 2.0 wasn\'t designed for agents that act autonomously',
    challenges: [
      {
        title: 'Agents get too much access',
        description: 'OAuth scopes like "read:web" or "write:cms" are too broad. You can\'t express "search only these domains" or "create drafts but don\'t publish." So you either block agents entirely or give them dangerous privileges.',
        icon: 'lock'
      },
      {
        title: 'No way to track intent',
        description: 'When an agent gets a token, you can\'t tell what task it\'s for. Is this web search for customer research or competitive intelligence? Without purpose binding, there\'s no way to prevent "purpose drift" or audit why an action happened.',
        icon: 'fileQuestion'
      },
      {
        title: 'Delegation creates black holes',
        description: 'Your agent calls a tool. That tool calls another tool. Three layers deep, who\'s actually responsible? Without delegation tracking, you lose visibility into privilege chains and can\'t enforce "no re-delegation" policies.',
        icon: 'chain'
      },
      {
        title: 'Impossible audit trails',
        description: 'When something goes wrong, can you trace it back to the specific agent, task, and authorization? With standard OAuth, the answer is usually "maybe" or "we think so." That\'s not good enough for regulated industries.',
        icon: 'eye'
      },
      {
        title: 'Valid actions, wrong context',
        description: 'An agent has permission to delete files. It deletes your production database. Technically authorized, catastrophically wrong. Without constraints like time windows or domain restrictions, you can\'t prevent abuse.',
        icon: 'alertTriangle'
      },
      {
        title: 'Rate limits? Good luck.',
        description: 'Try implementing "this agent can make 50 requests per hour to these domains only" with OAuth scopes. You\'ll end up with brittle, custom middleware that breaks every time you add a new agent.',
        icon: 'zap'
      }
    ]
  },
  solution: {
    title: 'How AAP Solves This',
    subtitle: 'Five structured claims that make agent authorization actually work',
    features: [
      {
        title: 'Know exactly which agent did what',
        description: 'The `agent` claim includes agent ID, type (LLM, bot, scripted), operator organization, and runtime environment. No more "some agent somewhere" in your logs—every action is traceable to a specific identity.',
        code: `{
  "agent": {
    "id": "agent-researcher-01",
    "type": "llm-autonomous",
    "operator": "org:blogcorp",
    "model": "gpt-4",
    "runtime": {
      "environment": "production",
      "version": "1.2.0"
    }
  }
}`,
        icon: 'user'
      },
      {
        title: 'Capabilities with teeth',
        description: 'Each `capabilities` entry specifies an exact action ("search.web", "cms.publish") plus server-side enforceable constraints: allowed domains, rate limits, time windows. The agent can\'t tamper with these—they\'re validated by your Resource Server.',
        code: `{
  "capabilities": [
    {
      "action": "search.web",
      "constraints": {
        "domains_allowed": ["example.org", "wikipedia.org"],
        "max_requests_per_hour": 50,
        "time_window": {
          "start": "2025-01-01T00:00:00Z",
          "end": "2025-01-31T23:59:59Z"
        }
      }
    },
    {
      "action": "cms.draft",
      "constraints": {
        "max_drafts_per_day": 10
      }
    }
  ]
}`,
        icon: 'key'
      },
      {
        title: 'Bind tokens to tasks',
        description: 'The `task` claim links the token to a specific task ID and declared purpose. This prevents "I got this token for research but I\'ll use it to delete production data." Your Resource Server can reject requests that don\'t match the task context.',
        code: `{
  "task": {
    "id": "task-123",
    "purpose": "research_and_draft_article",
    "topic": "OAuth for AI agents",
    "data_sensitivity": "public"
  }
}`,
        icon: 'target'
      },
      {
        title: 'See the full delegation chain',
        description: 'The `delegation` claim tracks every hop in the delegation chain with depth limits. Agent A delegates to Tool B, which delegates to Service C—you see the full path. Enforcing "max 2 delegation hops" becomes trivial.',
        code: `{
  "delegation": {
    "depth": 1,
    "max_depth": 2,
    "chain": [
      {
        "sub": "spiffe://example.com/agent/main",
        "delegated_at": 1735686000
      }
    ]
  },
  "act": {
    "sub": "spiffe://example.com/agent/main"
  }
}`,
        icon: 'gitBranch'
      },
      {
        title: 'Require human approval',
        description: 'The `oversight` claim lists actions that need human approval before execution. Your agent can create drafts all day, but publishing requires a human to click "yes." Build approval workflows directly into your authorization layer.',
        code: `{
  "oversight": {
    "requires_human_approval_for": [
      "cms.publish",
      "payment.execute"
    ],
    "approval_workflow": {
      "type": "slack_channel",
      "channel_id": "C1234567890"
    }
  }
}`,
        icon: 'userCheck'
      },
      {
        title: '100% compatible with OAuth 2.0',
        description: 'AAP isn\'t a replacement—it\'s an extension. Use standard Client Credentials flow, Token Exchange (RFC 8693), DPoP for proof-of-possession, and mTLS for transport security. Your existing OAuth infrastructure just works.',
        code: `# Client Credentials Flow
POST /token HTTP/1.1
Host: as.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=agent-researcher-01
&client_secret=...
&scope=aap:research

# Token Exchange for delegation
POST /token HTTP/1.1
grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=...
&requested_token_type=urn:ietf:params:oauth:token-type:access_token`,
        icon: 'shield'
      }
    ]
  },
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Six steps from policy to audit trail',
    steps: [
      {
        number: 1,
        title: 'Operator defines what agents can do',
        description: 'Before any agent gets a token, you configure policies in your Authorization Server: which capabilities, what constraints, which actions need approval.',
        icon: 'settings',
        actor: 'operator'
      },
      {
        number: 2,
        title: 'Agent authenticates',
        description: 'The agent proves its identity using Client Credentials with mTLS (certificate-based) or client secret.',
        icon: 'lock',
        actor: 'agent'
      },
      {
        number: 3,
        title: 'AS issues JWT with AAP claims',
        description: 'The Authorization Server issues a standard JWT containing OAuth claims (iss, sub, aud, exp) plus AAP claims (agent, capabilities, task, oversight, delegation).',
        icon: 'fileText',
        actor: 'as'
      },
      {
        number: 4,
        title: 'Agent calls Resource Server',
        description: 'The agent includes the token in the Authorization header. If DPoP or mTLS is required, the agent includes a cryptographic proof that it controls the token.',
        icon: 'send',
        actor: 'agent'
      },
      {
        number: 5,
        title: 'RS validates everything',
        description: 'The Resource Server validates: signature, expiry, audience, proof-of-possession, capability match for the requested action, constraint compliance (rate limits, domains, time windows), delegation depth, and oversight requirements.',
        icon: 'checkCircle',
        actor: 'rs'
      },
      {
        number: 6,
        title: 'Every action is logged',
        description: 'Authorized requests are executed and logged with trace IDs linking agent identity, task ID, action performed, and result. Denied requests are logged with the specific failure reason.',
        icon: 'fileSearch',
        actor: 'system'
      }
    ]
  },
  useCases: {
    title: 'Use Cases',
    subtitle: 'Real-world scenarios where AAP adds value',
    cases: [
      {
        id: 'research',
        title: 'Research Agent',
        scenario: 'An autonomous agent gathers information from multiple web sources to generate a report.',
        challenges: [
          'Needs access to search and scraping APIs',
          'Must be limited to trusted domains to prevent data exfiltration',
          'Requires rate limiting to avoid getting blocked or abusing APIs',
          'Purpose must be auditable for compliance'
        ],
        aapSolution: [
          '"search.web" capability with domains_allowed: ["example.org", "wikipedia.org"] and max_requests_per_hour: 50',
          'Task binding with purpose: "research_for_quarterly_report" and task.id linking to your project management system',
          'Delegation tracking if the agent calls external tools (translation, sentiment analysis)',
          'Full audit trail: every search logged with agent ID, task ID, timestamp, and target URL'
        ]
      },
      {
        id: 'content',
        title: 'Content Creation',
        scenario: 'An agent generates blog post drafts but requires human approval to publish.',
        challenges: [
          'Must be able to create drafts without restriction',
          'Cannot publish directly',
          'Needs tracking of auto-generated content',
          'Audit of changes to approved content'
        ],
        aapSolution: [
          'Capabilities: "cms.create_draft" (unrestricted) and "cms.publish" (requires approval)',
          'Oversight claim: requires_human_approval_for: ["cms.publish"] with Slack workflow integration',
          'Task context includes topic: "OAuth for AI agents" and target_audience: "developers"',
          'Delegation depth: 0 (no re-delegation allowed for content publishing)'
        ]
      },
      {
        id: 'delegation',
        title: 'Tool Delegation',
        scenario: 'A main agent delegates subtasks to specialized tools (translator, sentiment analyzer).',
        challenges: [
          'Each tool must have reduced permissions',
          'Delegation depth must be limited',
          'Complete delegation chain must be auditable',
          'Tools must not be able to re-delegate'
        ],
        aapSolution: [
          'Token Exchange (RFC 8693) for each delegation with automatic privilege reduction',
          'delegation.depth increments at each step: main (depth=0) → translator (depth=1) → analyzer (depth=2)',
          'max_depth=2 enforced by Authorization Server—depth=3 requests are rejected',
          'Full delegation chain logged: [main_agent, translator_tool, analyzer_service]',
          'Capabilities reduced at each hop: main has 10 actions, translator has 3, analyzer has 1'
        ]
      },
      {
        id: 'multitenant',
        title: 'Multi-tenant Platform',
        scenario: 'A SaaS platform allows each organization to configure their own AI agents.',
        challenges: [
          'Isolation between organizations',
          'Each agent can only access their tenant data',
          'Rate limits per organization',
          'Separate audit per tenant'
        ],
        aapSolution: [
          'agent.operator includes tenant ID: "org:acme", "org:techcorp"—enforced at Resource Server',
          'Capabilities filtered by tenant: org:acme agents can only access /api/acme/* resources',
          'Rate limits applied per tenant: org:acme gets 1000 req/hour, org:starter gets 100 req/hour',
          'Audit logs partitioned by operator for GDPR compliance and tenant isolation',
          'SPIFFE IDs include tenant namespace: spiffe://platform.example.com/acme/agent/research-01'
        ]
      },
      {
        id: 'trading',
        title: 'High-frequency Trading',
        scenario: 'A trading bot executes operations automatically with risk constraints.',
        challenges: [
          'Strict transaction limits per hour',
          'Specific time windows (market hours)',
          'Maximum amounts per operation',
          'Requires oversight on large operations'
        ],
        aapSolution: [
          'Capability "trading.execute" with max_transactions_per_hour: 100 and max_amount_usd: 10000',
          'time_window restricts operations to market hours: 09:30-16:00 EST weekdays only',
          'Constraints enforced server-side: attempts outside window or over limit are rejected with 403',
          'Oversight: requires_human_approval_for: ["trading.execute"] when amount > $50,000',
          'Short token lifetime (5 minutes) with token refresh for continuous trading sessions'
        ]
      }
    ]
  },
  benefits: {
    title: 'Why Teams Choose AAP',
    subtitle: 'Security, compliance, and operational benefits',
    categories: [
      {
        title: 'Security',
        icon: 'shield',
        items: [
          {
            title: 'Prevent agent impersonation',
            description: 'With mTLS or DPoP, only the agent with the private key can use the token. Token theft from logs or network capture becomes useless without the corresponding proof.'
          },
          {
            title: 'Block capability escalation',
            description: 'Constraints are enforced server-side. Even if an agent is compromised, it can\'t modify its own rate limits, allowed domains, or action permissions.'
          },
          {
            title: 'Catch purpose drift early',
            description: 'Task binding lets you reject requests that are technically authorized but contextually wrong—like using a "customer support" token to delete database records.'
          },
          {
            title: 'Control delegation sprawl',
            description: 'Depth limits prevent agents from excessively delegating. Permission reduction at each hop ensures delegated tokens never gain privileges.'
          }
        ]
      },
      {
        title: 'Compliance',
        icon: 'clipboard',
        items: [
          {
            title: 'Audit trails that actually work',
            description: 'Every action links to: agent ID, operator, task purpose, capability used, timestamp, and result. When auditors ask "who did this?", you have a real answer.'
          },
          {
            title: 'GDPR-aware by design',
            description: 'task.data_sensitivity (public/internal/confidential/personal) lets you enforce data handling policies at the authorization layer, not just app logic.'
          },
          {
            title: 'Built-in approval workflows',
            description: 'Oversight claims integrate human approval into authorization. High-risk actions (publishing, payments) require explicit human confirmation before execution.'
          },
          {
            title: 'Data minimization in tokens',
            description: 'AAP tokens include only necessary claims. No user emails, full names, or sensitive context—just IDs and references.'
          }
        ]
      },
      {
        title: 'Operational',
        icon: 'settings',
        items: [
          {
            title: 'Rate limiting that scales',
            description: 'Define per-capability rate limits once in your Authorization Server. Every Resource Server enforces them consistently without custom middleware.'
          },
          {
            title: 'No vendor lock-in',
            description: 'Built on OAuth 2.0, JWT, and IETF standards. Works with any OAuth library, JWT validator, or identity provider that supports custom claims.'
          },
          {
            title: 'Incremental adoption',
            description: 'Start with one agent and one Resource Server. AAP tokens work alongside traditional OAuth scopes—no need to migrate everything at once.'
          },
          {
            title: 'Interoperates with existing identity',
            description: 'Use OIDC for human identity, SPIFFE for workload identity, or any sub format. AAP doesn\'t replace your identity layer—it extends it.'
          }
        ]
      }
    ]
  },
  codeExample: {
    title: 'AAP Token Example',
    subtitle: 'A complete JWT with all five AAP claims—ready to validate',
    token: `{
  "iss": "https://as.example.com",
  "sub": "spiffe://example.com/agent/researcher-01",
  "aud": ["https://api.example.com"],
  "exp": 1735689600,
  "iat": 1735686000,
  "jti": "unique-token-id-abc123",

  "agent": {
    "id": "agent-researcher-01",
    "type": "llm-autonomous",
    "operator": "org:blogcorp",
    "model": "gpt-4",
    "runtime": {
      "environment": "production",
      "version": "1.2.0"
    }
  },

  "task": {
    "id": "task-123",
    "purpose": "research_and_draft_article",
    "topic": "OAuth for AI agents",
    "data_sensitivity": "public"
  },

  "capabilities": [
    {
      "action": "search.web",
      "constraints": {
        "domains_allowed": ["example.org", "wikipedia.org"],
        "max_requests_per_hour": 50
      }
    },
    {
      "action": "cms.draft",
      "constraints": {
        "max_drafts_per_day": 10
      }
    }
  ],

  "oversight": {
    "requires_human_approval_for": ["cms.publish"],
    "approval_workflow": {
      "type": "slack_channel",
      "channel_id": "C1234567890"
    }
  },

  "delegation": {
    "depth": 0,
    "max_depth": 2
  }
}`,
    annotations: {
      'iss': 'Issuer: Authorization Server that issued the token',
      'sub': 'Subject: Agent identity (SPIFFE ID)',
      'aud': 'Audience: Authorized Resource Servers',
      'exp': 'Expiry: Expiration timestamp (short tokens recommended)',
      'iat': 'Issued At: Issuance timestamp',
      'jti': 'JWT ID: Unique token identifier (for revocation)',
      'agent': 'Explicit agent identity with type, operator, and context',
      'task': 'Task binding with purpose and data sensitivity',
      'capabilities': 'Capabilities with server-side enforceable constraints',
      'oversight': 'Human oversight requirements',
      'delegation': 'Delegation tracking and limits'
    }
  },
  cta: {
    title: 'Start Building with AAP',
    subtitle: 'Everything you need: spec, schemas, reference implementation, and test vectors',
    primaryAction: {
      text: 'Read the Full Specification',
      href: '/specification'
    },
    secondaryActions: [
      {
        text: 'Explore on GitHub',
        href: 'https://github.com/aapspec',
        icon: 'github'
      },
      {
        text: 'Browse JSON Schemas',
        href: '/schemas',
        icon: 'book'
      },
      {
        text: 'Join the Discussion',
        href: 'https://github.com/aapspec/spec/discussions',
        icon: 'messageCircle'
      }
    ]
  },
  footer: {
    about: {
      title: 'About AAP',
      links: [
        { text: 'What is AAP', href: '#hero' },
        { text: 'Why AAP', href: '#problem' },
        { text: 'How it works', href: '#how-it-works' }
      ]
    },
    docs: {
      title: 'Documentation',
      links: [
        { text: 'Documentation Hub', href: '/docs' },
        { text: 'Getting Started', href: '/getting-started' },
        { text: 'Full Specification', href: '/specification' },
        { text: 'Examples', href: '#code-example' }
      ]
    },
    technical: {
      title: 'Technical Resources',
      links: [
        { text: 'JSON Schemas', href: '/schemas' },
        { text: 'Test Vectors', href: '/test-vectors' },
        { text: 'Reference Implementation', href: '/reference-impl' },
        { text: 'Migration Guide', href: '/migration' }
      ]
    },
    community: {
      title: 'Community',
      links: [
        { text: 'GitHub', href: 'https://github.com/aapspec' },
        { text: 'Discussions', href: 'https://github.com/aapspec/spec/discussions' },
        { text: 'Contributing', href: 'https://github.com/aapspec/spec/blob/main/CONTRIBUTING.md' }
      ]
    },
    standards: {
      title: 'Standards',
      links: [
        { text: 'OAuth 2.0', href: 'https://oauth.net/2/' },
        { text: 'JWT (RFC 7519)', href: 'https://datatracker.ietf.org/doc/html/rfc7519' },
        { text: 'Token Exchange (RFC 8693)', href: 'https://datatracker.ietf.org/doc/html/rfc8693' },
        { text: 'DPoP', href: 'https://datatracker.ietf.org/doc/html/rfc9449' }
      ]
    }
  }
};
