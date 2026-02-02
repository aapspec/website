# AAP Deployment Patterns

## Overview

This document provides deployment architectures and patterns for the Agent Authorization Profile (AAP) in production environments.

**Audience:** DevOps engineers, platform architects, SRE teams

---

## Deployment Architectures

### Architecture 1: Single-Tenant Standalone

**Description:** Dedicated AS and RS per organization.

```
┌─────────────────────────────────────────────┐
│           Organization Network              │
│                                             │
│  ┌──────────────┐         ┌──────────────┐ │
│  │     AS       │         │      RS      │ │
│  │              │◀────────│              │ │
│  │ (Flask/Python)│         │ (Your API)   │ │
│  └──────────────┘         └──────────────┘ │
│         │                         ▲         │
│         │ Issues tokens           │ Uses    │
│         ▼                         │ tokens  │
│  ┌──────────────┐                 │         │
│  │    Agents    │─────────────────┘         │
│  │              │                           │
│  └──────────────┘                           │
└─────────────────────────────────────────────┘
```

**Use Case:** Small/medium organizations, single security domain

**Pros:**
- Simple deployment
- Full control
- No multi-tenancy complexity

**Cons:**
- No resource sharing
- Each org manages their own AS

**Components:**
- 1x Authorization Server
- 1x Policy database
- Nx Resource Servers
- HSM for key storage

---

### Architecture 2: Multi-Tenant SaaS Platform

**Description:** Shared AS serving multiple organizations.

```
┌─────────────────────────────────────────────────────────┐
│                     SaaS Platform                        │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │          Authorization Server (Multi-Tenant)       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │ Org A    │  │ Org B    │  │ Org C    │        │  │
│  │  │ Policies │  │ Policies │  │ Policies │        │  │
│  │  └──────────┘  └──────────┘  └──────────┘        │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│                        ▼                                  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Shared Resource Servers                 │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │ │
│  │  │ API Gateway │ Service A │ Service B│            │ │
│  │  └─────────┘  └─────────┘  └─────────┘            │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  Org A Agents ──┐                                        │
│  Org B Agents ──┼─▶ Request tokens ─▶ Access APIs       │
│  Org C Agents ──┘                                        │
└─────────────────────────────────────────────────────────┘
```

**Use Case:** SaaS platforms serving multiple customers

**Pros:**
- Resource efficiency
- Centralized management
- Economies of scale

**Cons:**
- Complex isolation requirements
- Noisy neighbor risks
- Policy management complexity

**Key Requirements:**
- **Policy Isolation:** Strict separation by `operator` claim
- **Rate Limiting:** Per-tenant quotas
- **Audit Logging:** Separate logs per tenant
- **Key Management:** Separate signing keys per tenant (optional)

---

### Architecture 3: Federated (Multi-AS)

**Description:** Multiple AS instances across security domains.

```
┌───────────────────────────┐      ┌───────────────────────────┐
│     Trust Domain A        │      │     Trust Domain B        │
│                           │      │                           │
│  ┌──────────────┐        │      │        ┌──────────────┐  │
│  │   AS-A       │        │      │        │   AS-B       │  │
│  │ (Internal)   │        │      │        │ (Partners)   │  │
│  └──────┬───────┘        │      │        └──────┬───────┘  │
│         │                 │      │               │           │
│         ▼                 │      │               ▼           │
│  ┌──────────────┐        │      │        ┌──────────────┐  │
│  │   RS-A       │◀───────┼──────┼───────▶│   RS-B       │  │
│  │  (Internal   │   Cross-domain │        │  (Partner    │  │
│  │   APIs)      │   delegation   │        │   APIs)      │  │
│  └──────────────┘        │      │        └──────────────┘  │
└───────────────────────────┘      └───────────────────────────┘
         │                                      │
         ▼                                      ▼
    Internal Agents                        Partner Agents
```

**Use Case:** Enterprise with multiple security domains, B2B integrations

**Pros:**
- Domain-specific policies
- Blast radius containment
- Regulatory compliance (data residency)

**Cons:**
- Complex trust relationships
- Cross-domain token exchange
- Multiple key management systems

**Key Patterns:**
- **Token Exchange:** AS-A issues token; agent exchanges at AS-B for cross-domain access
- **Trust Establishment:** AS-A and AS-B exchange public keys via JWKS
- **Trace ID Rotation:** Regenerate `audit.trace_id` at trust boundary (privacy)

---

## Kubernetes Deployment

### Basic Deployment (Single-Tenant)

**Namespace:** `aap-system`

**Components:**
1. Authorization Server (Deployment + Service)
2. ConfigMap (policies)
3. Secret (private keys)
4. Ingress (HTTPS termination)

**`k8s/as-deployment.yaml`:**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aap-system
---
apiVersion: v1
kind: Secret
metadata:
  name: as-signing-keys
  namespace: aap-system
type: Opaque
data:
  private_key.pem: <base64-encoded-private-key>
  public_key.pem: <base64-encoded-public-key>
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: as-policies
  namespace: aap-system
data:
  org-acme-corp.json: |
    {
      "policy_id": "policy-acme-v1",
      "applies_to": {"operator": "org:acme-corp"},
      "allowed_capabilities": [...]
    }
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: as-server
  namespace: aap-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: as-server
  template:
    metadata:
      labels:
        app: as-server
    spec:
      containers:
      - name: as-server
        image: aap/as-server:latest
        ports:
        - containerPort: 8080
        env:
        - name: AAP_ISSUER
          value: "https://as.example.com"
        - name: AAP_PRIVATE_KEY_PATH
          value: "/keys/private_key.pem"
        - name: AAP_POLICY_PATH
          value: "/policies"
        volumeMounts:
        - name: signing-keys
          mountPath: /keys
          readOnly: true
        - name: policies
          mountPath: /policies
          readOnly: true
        resources:
          requests:
            memory: "256Mi"
            cpu: "500m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
      volumes:
      - name: signing-keys
        secret:
          secretName: as-signing-keys
      - name: policies
        configMap:
          name: as-policies
---
apiVersion: v1
kind: Service
metadata:
  name: as-service
  namespace: aap-system
spec:
  selector:
    app: as-server
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: as-ingress
  namespace: aap-system
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - as.example.com
    secretName: as-tls
  rules:
  - host: as.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: as-service
            port:
              number: 80
```

**Deploy:**

```bash
kubectl apply -f k8s/as-deployment.yaml
kubectl get pods -n aap-system
kubectl logs -f deployment/as-server -n aap-system
```

---

### High Availability Deployment

**Requirements:**
- 3+ AS replicas (different availability zones)
- Distributed rate limiting (Redis)
- Shared policy storage (ConfigMap or external DB)
- Load balancer with session affinity (not required, but helps)

**Additional Components:**

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: aap-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: aap-system
spec:
  selector:
    app: redis
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
```

Update AS deployment to use Redis for rate limiting:

```yaml
env:
- name: AAP_REDIS_URL
  value: "redis://redis:6379"
```

---

## Docker Compose Deployment

### Simple Deployment (Development/Testing)

**`docker-compose.yml`:**

```yaml
version: '3.8'

services:
  as:
    build:
      context: ./reference-impl
      dockerfile: Dockerfile.as
    ports:
      - "8080:8080"
    environment:
      - AAP_ISSUER=https://as.example.com
      - AAP_AS_PORT=8080
      - AAP_PRIVATE_KEY_PATH=/keys/as_private_key.pem
      - AAP_POLICY_PATH=/policies
    volumes:
      - ./keys:/keys:ro
      - ./policies:/policies:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/"]
      interval: 30s
      timeout: 10s
      retries: 3

  rs:
    build:
      context: ./reference-impl
      dockerfile: Dockerfile.rs
    ports:
      - "8081:8081"
    environment:
      - AAP_RS_AUDIENCE=https://api.example.com
      - AAP_RS_PORT=8081
      - AAP_TRUSTED_ISSUERS=https://as.example.com
      - AAP_PUBLIC_KEY_PATH=/keys/as_public_key.pem
    volumes:
      - ./keys:/keys:ro
    depends_on:
      - as
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

**Run:**

```bash
docker-compose up -d
docker-compose logs -f as
docker-compose ps
```

---

### Production Deployment (Docker Compose)

Add TLS termination, monitoring, and backups:

```yaml
services:
  # ... (previous services)

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - as
      - rs

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=changeme
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  redis-data:
  prometheus-data:
  grafana-data:
```

---

## Cloud-Specific Patterns

### AWS Deployment

**Components:**
- **ECS/Fargate:** Run AS containers
- **ALB:** Load balancing + TLS termination
- **ElastiCache (Redis):** Distributed rate limiting
- **Secrets Manager:** Store private keys
- **Parameter Store:** Store policies
- **CloudWatch:** Logging and monitoring

**Architecture:**

```
Internet Gateway
      │
      ▼
Application Load Balancer (ALB)
      │
      ├─▶ Target Group (AS)
      │        └─▶ ECS Tasks (AS replicas)
      │                 │
      │                 ├─▶ ElastiCache (Redis)
      │                 ├─▶ Secrets Manager (keys)
      │                 └─▶ Parameter Store (policies)
      │
      └─▶ Target Group (RS)
               └─▶ ECS Tasks (RS replicas)
```

**Terraform Example:**

```hcl
resource "aws_ecs_cluster" "aap" {
  name = "aap-cluster"
}

resource "aws_ecs_task_definition" "as" {
  family                   = "aap-as"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"

  container_definitions = jsonencode([{
    name  = "as-server"
    image = "aap/as-server:latest"
    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]
    environment = [
      {name = "AAP_ISSUER", value = "https://as.example.com"},
      {name = "AAP_REDIS_URL", value = aws_elasticache_cluster.redis.cache_nodes[0].address}
    ]
    secrets = [
      {name = "AAP_PRIVATE_KEY", valueFrom = aws_secretsmanager_secret.as_private_key.arn}
    ]
  }])
}

resource "aws_ecs_service" "as" {
  name            = "aap-as-service"
  cluster         = aws_ecs_cluster.aap.id
  task_definition = aws_ecs_task_definition.as.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnets
    security_groups = [aws_security_group.as.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.as.arn
    container_name   = "as-server"
    container_port   = 8080
  }
}
```

---

### GCP Deployment

**Components:**
- **Cloud Run:** Serverless AS containers
- **Cloud Load Balancing:** HTTPS load balancer
- **Memorystore (Redis):** Rate limiting
- **Secret Manager:** Private keys
- **Cloud Logging:** Centralized logs

**Deploy to Cloud Run:**

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/aap-as

# Deploy to Cloud Run
gcloud run deploy aap-as \
  --image gcr.io/PROJECT_ID/aap-as \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars AAP_ISSUER=https://as.example.com \
  --set-secrets AAP_PRIVATE_KEY=as-private-key:latest
```

---

## Monitoring and Observability

### Metrics to Track

**Authorization Server:**
```
aap_as_token_issuance_total{operator="org:acme"}
aap_as_token_exchange_total
aap_as_policy_evaluation_duration_seconds
aap_as_errors_total{type="invalid_client|policy_error"}
```

**Resource Server:**
```
aap_rs_validation_total{result="success|failure"}
aap_rs_validation_duration_seconds
aap_rs_constraint_violations_total{type="rate_limit|domain|time_window"}
aap_rs_capability_mismatches_total
```

**Prometheus Configuration:**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'aap-as'
    static_configs:
      - targets: ['as:8080']
    metrics_path: '/metrics'

  - job_name: 'aap-rs'
    static_configs:
      - targets: ['rs:8081']
    metrics_path: '/metrics'
```

### Grafana Dashboards

**AS Dashboard Panels:**
- Token issuance rate (per operator)
- Token Exchange rate
- Policy evaluation latency (p50, p95, p99)
- Error rate by type

**RS Dashboard Panels:**
- Authorization success rate
- Constraint violation rate (by type)
- Validation latency
- Top agents by request volume

---

## Security Best Practices

### 1. Key Management

**Development:**
- Store keys in local files (`.gitignore`)
- Rotate keys weekly

**Production:**
- **AWS:** Secrets Manager + KMS
- **GCP:** Secret Manager
- **Azure:** Key Vault
- **On-Prem:** HSM (Hardware Security Module)
- Rotate keys every 90 days

### 2. Network Security

- **TLS Everywhere:** AS and RS MUST use TLS 1.3
- **mTLS:** Consider for high-security environments
- **Firewall Rules:** AS accessible only from authorized networks
- **DDoS Protection:** Use cloud provider DDoS mitigation

### 3. Rate Limiting

- **AS Endpoint:** Limit token requests (prevent token issuance abuse)
- **Per-Client:** Track by `client_id`, limit to 100 req/min
- **Global:** Overall AS rate limit (e.g., 10k req/sec)

### 4. Audit Logging

- **Log All Token Issuance:** Include operator, task, capabilities
- **Log Validation Failures:** Include error type, agent, action
- **Tamper-Evident Logs:** Use log aggregation service with integrity checks
- **Retention:** Follow compliance requirements (90 days minimum for SOC2)

---

## Troubleshooting

### AS Issues

**Problem:** Token issuance fails with "No policy found"

**Solution:**
```bash
# Check policies directory
ls -la /policies
# Verify policy operator matches request
jq '.applies_to.operator' policies/org-acme-corp.json
```

**Problem:** AS returns 500 on token request

**Solution:**
```bash
# Check AS logs
docker logs as-container
# Common causes: invalid key file, missing policy, syntax error in policy JSON
```

### RS Issues

**Problem:** RS rejects valid tokens with "invalid_token"

**Solution:**
```bash
# Verify AS public key is correct
cat /keys/as_public_key.pem
# Check RS trusted issuers list
echo $AAP_TRUSTED_ISSUERS
# Decode token to verify issuer matches
jwt decode $TOKEN | jq '.iss'
```

**Problem:** Constraint violations not enforced

**Solution:**
```bash
# Check if constraint enforcer is initialized
# Check if Redis is accessible (for distributed rate limiting)
redis-cli -h redis ping
```

---

## Checklist: Production Readiness

- [ ] AS deployed with 3+ replicas
- [ ] Private keys in HSM or secure vault
- [ ] TLS configured with valid certificates
- [ ] Distributed rate limiting (Redis/Memcached)
- [ ] Monitoring dashboards (AS + RS metrics)
- [ ] Alerting configured (validation failures, high error rate)
- [ ] Audit logging to SIEM
- [ ] Backup and disaster recovery plan
- [ ] Load testing completed (>10k req/sec)
- [ ] Security review/penetration testing
- [ ] Documentation (runbooks, incident response)
- [ ] Key rotation schedule (90 days)

---

**Document Version:** 1.0
**Last Updated:** 2025-02-01
**Maintainer:** AAP Implementation Team
