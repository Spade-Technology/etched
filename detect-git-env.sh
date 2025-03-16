#!/bin/bash

# This script runs a specified npm/pnpm script with a branch-specific environment file
# Designed for monorepos where all .env files are at the root level
# Usage: ./monorepo-env-runner.sh <script-name>

# Check if script name is provided
if [ -z "$1" ]; then
  echo "Error: No script name provided"
  echo "Usage: ./monorepo-env-runner.sh <script-name>"
  exit 1
fi

SCRIPT_NAME=$1

# Get current git branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Remove any illegal characters for filenames
SANITIZED_BRANCH=$(echo "$CURRENT_BRANCH" | sed 's/[^a-zA-Z0-9-]/-/g')

# Get git root directory
GIT_ROOT=$(git rev-parse --show-toplevel)

# Define the branch-specific .env file path at the root
ENV_FILE="$GIT_ROOT/.env.$SANITIZED_BRANCH"

# Check if branch-specific .env file exists
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment from $ENV_FILE for branch $CURRENT_BRANCH"
  npx env-cmd -f "$ENV_FILE" pnpm run $SCRIPT_NAME
else
  echo "No branch-specific environment file found at .env.$SANITIZED_BRANCH"
  
  # Check if default .env exists at root
  if [ -f "$GIT_ROOT/.env" ]; then
    read -p "Would you like to use the default .env file instead? (y/n): " use_default
    if [[ $use_default == "y" || $use_default == "Y" ]]; then
      echo "Using default .env file"
      npx env-cmd -f "$GIT_ROOT/.env" pnpm run $SCRIPT_NAME
    else
      echo "Operation cancelled"
      exit 1
    fi
  else
    echo "No default .env file found either"
    echo "Please create .env.$SANITIZED_BRANCH before running scripts for this branch"
    exit 1
  fi
fi