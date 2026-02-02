"""
Policy Engine for AAP Authorization Server

Evaluates operator policies to determine which capabilities to grant to agents.
"""

import json
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field


@dataclass
class Capability:
    """Represents a capability with action and constraints"""

    action: str
    constraints: Dict[str, Any] = field(default_factory=dict)
    description: Optional[str] = None
    resources: Optional[List[str]] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JWT payload"""
        result = {"action": self.action}
        if self.constraints:
            result["constraints"] = self.constraints
        if self.description:
            result["description"] = self.description
        if self.resources:
            result["resources"] = self.resources
        return result


@dataclass
class OperatorPolicy:
    """Represents an operator's authorization policy for agents"""

    policy_id: str
    policy_version: str
    operator: str
    allowed_capabilities: List[Dict[str, Any]]
    global_constraints: Dict[str, Any] = field(default_factory=dict)
    oversight: Optional[Dict[str, Any]] = None
    audit: Optional[Dict[str, Any]] = None
    token_lifetime: int = 3600
    max_delegation_depth: int = 2
    require_pop: bool = False

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "OperatorPolicy":
        """Create policy from dictionary"""
        return cls(
            policy_id=data.get("policy_id", ""),
            policy_version=data.get("policy_version", "1.0"),
            operator=data.get("applies_to", {}).get("operator", ""),
            allowed_capabilities=data.get("allowed_capabilities", []),
            global_constraints=data.get("global_constraints", {}),
            oversight=data.get("oversight"),
            audit=data.get("audit"),
            token_lifetime=data.get("global_constraints", {}).get(
                "token_lifetime", 3600
            ),
            max_delegation_depth=data.get("global_constraints", {}).get(
                "max_delegation_depth", 2
            ),
            require_pop=data.get("global_constraints", {}).get("require_pop", False),
        )


class PolicyEngine:
    """Engine for evaluating authorization policies"""

    def __init__(self, policy_dir: str):
        """
        Initialize policy engine

        Args:
            policy_dir: Directory containing policy JSON files
        """
        self.policy_dir = policy_dir
        self.policies: Dict[str, OperatorPolicy] = {}
        self._load_policies()

    def _load_policies(self):
        """Load all policies from policy directory"""
        if not os.path.exists(self.policy_dir):
            os.makedirs(self.policy_dir)
            return

        for filename in os.listdir(self.policy_dir):
            if filename.endswith(".json"):
                filepath = os.path.join(self.policy_dir, filename)
                try:
                    with open(filepath, "r") as f:
                        policy_data = json.load(f)
                        policy = OperatorPolicy.from_dict(policy_data)
                        operator = policy.operator
                        self.policies[operator] = policy
                except Exception as e:
                    print(f"Error loading policy {filename}: {e}")

    def get_policy(self, operator: str) -> Optional[OperatorPolicy]:
        """
        Get policy for an operator

        Args:
            operator: Operator identifier

        Returns:
            OperatorPolicy if found, None otherwise
        """
        return self.policies.get(operator)

    def evaluate_capabilities(
        self,
        operator: str,
        requested_capabilities: List[str],
        task_purpose: Optional[str] = None,
    ) -> List[Capability]:
        """
        Evaluate requested capabilities against operator policy

        Args:
            operator: Operator identifier
            requested_capabilities: List of requested action names
            task_purpose: Task purpose (for future purpose-based filtering)

        Returns:
            List of granted Capability objects
        """
        policy = self.get_policy(operator)
        if not policy:
            # No policy found; deny all
            return []

        granted = []

        for requested_action in requested_capabilities:
            # Find matching capability in policy
            for allowed_cap in policy.allowed_capabilities:
                if allowed_cap.get("action") == requested_action:
                    # Capability is allowed
                    constraints = allowed_cap.get("default_constraints", {}).copy()

                    # Merge with global constraints
                    constraints.update(policy.global_constraints)

                    capability = Capability(
                        action=requested_action,
                        constraints=constraints,
                        description=allowed_cap.get("description"),
                    )
                    granted.append(capability)
                    break

        return granted

    def reduce_capabilities_for_delegation(
        self, capabilities: List[Capability], delegation_depth: int
    ) -> List[Capability]:
        """
        Reduce capabilities for delegation (privilege reduction)

        Args:
            capabilities: Original capabilities
            delegation_depth: Current delegation depth

        Returns:
            Reduced capabilities list
        """
        reduced = []

        for cap in capabilities:
            # Create a copy with tightened constraints
            reduced_constraints = cap.constraints.copy()

            # Reduce rate limits by 50% per depth level
            reduction_factor = 0.5 ** delegation_depth

            if "max_requests_per_hour" in reduced_constraints:
                original = reduced_constraints["max_requests_per_hour"]
                reduced_constraints["max_requests_per_hour"] = max(
                    1, int(original * reduction_factor)
                )

            if "max_requests_per_minute" in reduced_constraints:
                original = reduced_constraints["max_requests_per_minute"]
                reduced_constraints["max_requests_per_minute"] = max(
                    1, int(original * reduction_factor)
                )

            # Reduce max_depth (prevent infinite delegation chains)
            if "max_depth" in reduced_constraints:
                reduced_constraints["max_depth"] = max(
                    0, reduced_constraints["max_depth"] - delegation_depth
                )

            reduced_cap = Capability(
                action=cap.action,
                constraints=reduced_constraints,
                description=cap.description,
                resources=cap.resources,
            )
            reduced.append(reduced_cap)

        return reduced

    def merge_constraints(
        self, capability_constraints: Dict[str, Any], global_constraints: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Merge capability-specific and global constraints

        Args:
            capability_constraints: Constraints from capability definition
            global_constraints: Global constraints from policy

        Returns:
            Merged constraints dictionary
        """
        merged = capability_constraints.copy()

        # Global constraints can add or tighten (but not loosen) restrictions
        for key, value in global_constraints.items():
            if key not in merged:
                merged[key] = value
            else:
                # For numeric constraints, use the more restrictive (lower) value
                if isinstance(value, (int, float)) and isinstance(
                    merged[key], (int, float)
                ):
                    merged[key] = min(value, merged[key])
                # For lists (e.g., domains_allowed), use intersection
                elif isinstance(value, list) and isinstance(merged[key], list):
                    # Intersection of allowed domains
                    if "allowed" in key:
                        merged[key] = list(set(merged[key]) & set(value))
                    # Union of blocked domains
                    elif "blocked" in key:
                        merged[key] = list(set(merged[key]) | set(value))

        return merged
