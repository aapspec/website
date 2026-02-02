# Agent Authorization Profile (AAP) — Summary

Reference document on the AAP profile. The full specification is in [AAP_Complete_Draft_Specification.md](AAP_Complete_Draft_Specification.md).

---

## Protocol summary

The **Agent Authorization Profile (AAP)** would be an authorization profile built on OAuth 2.0 and JWT, designed for **autonomous AI agents** that act as clients and call APIs. It does not define a new protocol: it extends OAuth 2.0 with **structured claims** (agent identity, task, capabilities, human oversight, delegation, context, audit) and **validation rules** that Resource Servers must apply before allowing an operation.

In AAP, the OAuth “client” is the agent (e.g. an LLM or a bot). The Authorization Server issues JWT tokens that carry these additional claims; Resource Servers validate them and enforce limits by task, by capability, and by delegation chain. The profile is compatible with existing standard mechanisms: Token Exchange (RFC 8693), proof-of-possession (DPoP, mTLS), revocation and introspection, and optionally OpenID Connect and SPIFFE for identity.

---

## Why this protocol would exist

- **OAuth and scopes were designed for user–application–API flows.** In those flows there is typically a person who authorizes and an app that acts with broad but scope-limited permissions. With autonomous agents the context changes: actions can be very frequent, there is no human “click” on each one, risk depends on **task purpose**, and execution can be **delegated** to tools or other agents. Scopes alone do not express well “who is the agent”, “what task is this token for”, “what concrete actions can be performed and with what limits”, or “which operations require human oversight”.

- **Without a profile like AAP, it is hard to have contextual, auditable authorization for agents.** Clear risks emerge: agent impersonation, capability escalation, use of the token for a purpose other than the declared one, excessive or malicious delegation, large-scale abuse with “valid” but harmful actions, lack of traceability (which agent did what and under what authorization). AAP addresses that problem: it provides a **threat model** and **mitigations** (short-lived tokens, proof-of-possession, task binding, capabilities with constraints, delegation chain, audit) without inventing a new ecosystem, by building on OAuth 2.0, JWT, and related standards.

- **It avoids reinventing the wheel.** The profile builds on OAuth 2.0, JWT, Token Exchange, DPoP, mTLS, OIDC, and optionally SPIFFE. It does not replace those standards; it adds a layer of **claims and rules** so that organizations, agents, and services can establish verifiable “operational contracts”: who can do what, under what purpose, and with what limits.

---

## What this protocol would be for

- **Give agents explicit, verifiable identity.** Systems can know which agent (and, where applicable, which model, operator, environment) is behind each request, and apply policies accordingly.

- **Capability-based authorization with enforceable constraints.** Not just “broad scope”, but concrete actions (`action`) and constraints (domains, rates, time windows, etc.) that the Resource Server enforces on the server side, without trusting agent logic.

- **Bind tokens to a declared task and purpose.** Each token can carry `task.id`, `task.purpose`, data sensitivity, etc., so that Resource Servers can reject requests that do not match the declared purpose (avoiding “purpose drift”).

- **Make delegation between agents and tools auditable.** With Token Exchange and delegation claims (`depth`, `chain`, and optionally `act`), delegation depth and scope can be limited and the chain of actors can be traced.

- **Express human oversight requirements.** Claims such as `aap_oversight` / `oversight` allow indicating which actions require human approval; the Resource Server or an orchestrator can require an approval flow before executing them.

- **Stay compatible with the current ecosystem.** Those already using OAuth 2.0, JWT, DPoP, mTLS, OIDC, or SPIFFE can adopt AAP as an additional profile: same flows and mechanisms, with extra claims and validation rules for agents.

Overall, the protocol would serve to **authorize AI agents that call APIs in a secure, contextual, and auditable way**, without replacing OAuth or existing identity standards, and enabling organizations and services to agree in a verifiable manner on what each agent can do, in which task, and with what limits.
