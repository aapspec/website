"""
Constraint Enforcer for AAP Resource Server

Enforces capability constraints (rate limits, domain restrictions, time windows, etc.).
"""

import time
from typing import Dict, Any, Optional
from datetime import datetime
from urllib.parse import urlparse
from collections import defaultdict


class ConstraintViolationError(Exception):
    """Constraint was violated"""

    def __init__(self, constraint_type: str, description: str, http_status: int = 403):
        self.constraint_type = constraint_type
        self.description = description
        self.http_status = http_status
        super().__init__(description)


class ConstraintEnforcer:
    """Enforces AAP capability constraints"""

    def __init__(self):
        """Initialize constraint enforcer"""
        # In-memory rate limiting state (production should use Redis or similar)
        self.hourly_counters: Dict[str, Dict[int, int]] = defaultdict(dict)
        self.minute_counters: Dict[str, Dict[int, int]] = defaultdict(dict)
        self.request_timestamps: Dict[str, list] = defaultdict(list)

    def enforce_constraints(
        self,
        constraints: Dict[str, Any],
        request: Dict[str, Any],
        token_jti: str,
    ):
        """
        Enforce all constraints in capability

        Args:
            constraints: Constraints dict from capability
            request: Request context (action, target, etc.)
            token_jti: Token JTI for rate limiting tracking

        Raises:
            ConstraintViolationError: If any constraint is violated

        Section 5.6: Multiple constraints within capability use AND semantics
        """
        # Rate limiting constraints (Section 5.6.1)
        self._enforce_rate_limits(constraints, token_jti)

        # Domain and network constraints (Section 5.6.2)
        if "target_url" in request:
            self._enforce_domain_constraints(constraints, request["target_url"])

        # Time-based constraints (Section 5.6.3)
        self._enforce_time_window(constraints)

        # Data and security constraints (Section 5.6.5)
        self._enforce_data_constraints(constraints, request)

    def _enforce_rate_limits(self, constraints: Dict[str, Any], token_jti: str):
        """
        Enforce rate limiting constraints

        Section 5.6.1: Rate Limiting Constraints
        """
        now = int(time.time())

        # max_requests_per_hour: Fixed hourly window, resets at minute 0
        if "max_requests_per_hour" in constraints:
            max_per_hour = constraints["max_requests_per_hour"]
            current_hour = now // 3600  # Hour bucket

            # Get current count for this hour
            hour_key = token_jti
            if hour_key not in self.hourly_counters:
                self.hourly_counters[hour_key] = {}

            count = self.hourly_counters[hour_key].get(current_hour, 0)

            if count >= max_per_hour:
                raise ConstraintViolationError(
                    "max_requests_per_hour",
                    "Rate limit exceeded for this capability",
                    http_status=429,
                )

            # Increment counter
            self.hourly_counters[hour_key][current_hour] = count + 1

            # Clean up old hour buckets (keep only current and previous hour)
            for hour_bucket in list(self.hourly_counters[hour_key].keys()):
                if hour_bucket < current_hour - 1:
                    del self.hourly_counters[hour_key][hour_bucket]

        # max_requests_per_minute: Sliding 60-second window
        if "max_requests_per_minute" in constraints:
            max_per_minute = constraints["max_requests_per_minute"]

            # Get request timestamps for this token
            timestamps = self.request_timestamps[token_jti]

            # Remove timestamps older than 60 seconds
            cutoff = now - 60
            timestamps = [ts for ts in timestamps if ts > cutoff]
            self.request_timestamps[token_jti] = timestamps

            if len(timestamps) >= max_per_minute:
                raise ConstraintViolationError(
                    "max_requests_per_minute",
                    "Rate limit exceeded for this capability",
                    http_status=429,
                )

            # Add current timestamp
            timestamps.append(now)

    def _enforce_domain_constraints(self, constraints: Dict[str, Any], target_url: str):
        """
        Enforce domain allowlist/blocklist

        Section 5.6.2: Domain and Network Constraints
        """
        parsed = urlparse(target_url)
        domain = parsed.netloc

        if not domain:
            raise ConstraintViolationError(
                "invalid_target",
                "Target URL does not contain a valid domain",
            )

        # domains_blocked takes precedence
        if "domains_blocked" in constraints:
            blocked = constraints["domains_blocked"]
            if self._domain_matches_list(domain, blocked):
                raise ConstraintViolationError(
                    "aap_domain_not_allowed",
                    "The requested domain is blocked",
                )

        # domains_allowed (allowlist)
        if "domains_allowed" in constraints:
            allowed = constraints["domains_allowed"]
            if not self._domain_matches_list(domain, allowed):
                raise ConstraintViolationError(
                    "aap_domain_not_allowed",
                    "The requested domain is not in the allowed list",
                )

    @staticmethod
    def _domain_matches_list(domain: str, domain_list: list) -> bool:
        """
        Check if domain matches any entry in list using DNS suffix matching

        Section 5.6.2: subdomain.example.org matches example.org in allowlist
        """
        for allowed_domain in domain_list:
            # Exact match
            if domain == allowed_domain:
                return True

            # Suffix match: domain ends with .allowed_domain
            if domain.endswith("." + allowed_domain):
                return True

        return False

    def _enforce_time_window(self, constraints: Dict[str, Any]):
        """
        Enforce time window constraints

        Section 5.6.3: Time-Based Constraints
        """
        if "time_window" not in constraints:
            return

        time_window = constraints["time_window"]
        start = time_window.get("start")
        end = time_window.get("end")

        now = datetime.utcnow()

        # Parse ISO 8601 timestamps
        if start:
            start_dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
            if now < start_dt:
                raise ConstraintViolationError(
                    "aap_capability_expired",
                    "Request is before the allowed time window",
                )

        if end:
            end_dt = datetime.fromisoformat(end.replace("Z", "+00:00"))
            if now >= end_dt:
                raise ConstraintViolationError(
                    "aap_capability_expired",
                    "Request is after the allowed time window",
                )

    def _enforce_data_constraints(self, constraints: Dict[str, Any], request: Dict[str, Any]):
        """
        Enforce data and security constraints

        Section 5.6.5: Data and Security Constraints
        """
        # allowed_methods
        if "allowed_methods" in constraints:
            allowed_methods = constraints["allowed_methods"]
            method = request.get("method", "GET")
            if method not in allowed_methods:
                raise ConstraintViolationError(
                    "method_not_allowed",
                    f"HTTP method {method} is not allowed for this capability",
                )

        # max_request_size
        if "max_request_size" in constraints:
            max_size = constraints["max_request_size"]
            request_size = request.get("content_length", 0)
            if request_size > max_size:
                raise ConstraintViolationError(
                    "request_too_large",
                    "Request payload exceeds maximum allowed size",
                    http_status=413,
                )

        # data_classification_max
        # (requires resource metadata; not enforced in reference implementation)
