"""
Configuration for AAP Authorization Server
"""

import os
from typing import Dict, Any


class ASConfig:
    """Configuration for Authorization Server"""

    def __init__(self):
        # Server configuration
        self.issuer = os.getenv("AAP_ISSUER", "https://as.example.com")
        self.port = int(os.getenv("AAP_AS_PORT", "8080"))
        self.host = os.getenv("AAP_AS_HOST", "0.0.0.0")

        # Token configuration
        self.default_token_lifetime = int(
            os.getenv("AAP_DEFAULT_TOKEN_LIFETIME", "3600")
        )  # 1 hour
        self.delegated_token_lifetime_reduction = float(
            os.getenv("AAP_DELEGATED_LIFETIME_REDUCTION", "0.5")
        )  # 50% reduction

        # Signing configuration
        self.signing_algorithm = os.getenv("AAP_SIGNING_ALGORITHM", "ES256")
        self.private_key_path = os.getenv(
            "AAP_PRIVATE_KEY_PATH", "keys/as_private_key.pem"
        )
        self.public_key_path = os.getenv(
            "AAP_PUBLIC_KEY_PATH", "keys/as_public_key.pem"
        )
        self.key_id = os.getenv("AAP_KEY_ID", "aap-as-key-1")

        # Policy configuration
        self.policy_path = os.getenv("AAP_POLICY_PATH", "policies")
        self.default_max_delegation_depth = int(
            os.getenv("AAP_DEFAULT_MAX_DELEGATION_DEPTH", "2")
        )

        # Revocation configuration
        self.enable_revocation = os.getenv("AAP_ENABLE_REVOCATION", "true").lower() == "true"
        self.revocation_cache_ttl = int(os.getenv("AAP_REVOCATION_CACHE_TTL", "300"))

    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return {
            "issuer": self.issuer,
            "port": self.port,
            "host": self.host,
            "default_token_lifetime": self.default_token_lifetime,
            "signing_algorithm": self.signing_algorithm,
            "key_id": self.key_id,
            "default_max_delegation_depth": self.default_max_delegation_depth,
        }


# Global configuration instance
config = ASConfig()
