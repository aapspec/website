#!/bin/bash
# Generate keys for AAP Authorization Server

KEYS_DIR="../keys"
mkdir -p "$KEYS_DIR"

echo "Generating ES256 (ECDSA P-256) key pair for AS..."
openssl ecparam -genkey -name prime256v1 -noout -out "$KEYS_DIR/as_private_key.pem"
openssl ec -in "$KEYS_DIR/as_private_key.pem" -pubout -out "$KEYS_DIR/as_public_key.pem"

echo ""
echo "Keys generated successfully:"
echo "  Private key: $KEYS_DIR/as_private_key.pem"
echo "  Public key:  $KEYS_DIR/as_public_key.pem"
echo ""
echo "IMPORTANT: Keep the private key secure and never commit it to version control!"
