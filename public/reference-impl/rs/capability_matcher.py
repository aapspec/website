"""
Capability Matcher for AAP Resource Server

Matches requested actions against token capabilities.
"""

from typing import Dict, List, Any, Optional


class CapabilityMatcher:
    """Matches actions to capabilities"""

    @staticmethod
    def find_matching_capability(
        capabilities: List[Dict[str, Any]], requested_action: str
    ) -> Optional[Dict[str, Any]]:
        """
        Find capability that matches requested action

        Args:
            capabilities: List of capability objects from token
            requested_action: Requested action name (e.g., "search.web")

        Returns:
            Matching capability dict, or None if no match

        Section 5.5: Action names use exact string matching (case-sensitive)
        """
        for capability in capabilities:
            action = capability.get("action")
            if action == requested_action:
                return capability

        return None

    @staticmethod
    def validate_action_format(action: str) -> bool:
        """
        Validate action name format against ABNF grammar

        Section 5.5: action-name = component *( "." component )
                     component = ALPHA *( ALPHA / DIGIT / "-" / "_" )

        Args:
            action: Action name to validate

        Returns:
            True if valid, False otherwise
        """
        if not action:
            return False

        components = action.split(".")
        if not components:
            return False

        for component in components:
            if not component:
                # Empty component (e.g., "search..web")
                return False

            # First character must be alphabetic
            if not component[0].isalpha():
                return False

            # Remaining characters must be alphanumeric, hyphen, or underscore
            for char in component[1:]:
                if not (char.isalnum() or char in "-_"):
                    return False

        return True
