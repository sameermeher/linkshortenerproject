#!/bin/bash
# Run prettier only when a file was created or edited.
TOOL_NAME=$(cat /dev/stdin | jq -r '.toolName')

if [[ "$TOOL_NAME" == "create" || "$TOOL_NAME" == "edit" ]]; then
  npx prettier --write .
fi
