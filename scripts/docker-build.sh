#!/bin/bash

# Default values
IMAGE_NAME="attio-mcp-server"
TAG="latest"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --name) IMAGE_NAME="$2"; shift ;;
        --tag) TAG="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

echo "Building Docker image: $IMAGE_NAME:$TAG"

# Ensure we're in the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Build the Docker image
docker build -t "$IMAGE_NAME:$TAG" .

echo "Docker image built successfully: $IMAGE_NAME:$TAG"