#!/bin/bash

echo -n "Password: "
read -s PASSWORD
echo

HASHED_PASSWORD=$(echo -n $PASSWORD | sha256sum | cut -d' ' -f1)

cat > docker/code_server/config.yaml << EOF
bind-addr: 0.0.0.0:8080
auth: password
password: $PASSWORD
hashed-password: $HASHED_PASSWORD
cert: false
EOF
