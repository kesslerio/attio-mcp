#!/bin/bash

# Script to build and tag Docker images for Attio MCP Server

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
IMAGE_NAME="attio-mcp-server"
IMAGE_TAG="latest"
BUILD_ARGS=""

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --name) IMAGE_NAME="$2"; shift 2 ;;
    --tag) IMAGE_TAG="$2"; shift 2 ;;
    --build-arg) BUILD_ARGS="$BUILD_ARGS --build-arg $2"; shift 2 ;;
    --help) 
      echo -e "${YELLOW}Attio MCP Docker Build Script${NC}"
      echo -e "Usage: ./scripts/docker-build.sh [options]"
      echo -e "\nOptions:"
      echo -e "  --name NAME     Set the image name (default: attio-mcp-server)"
      echo -e "  --tag TAG       Set the image tag (default: latest)"
      echo -e "  --build-arg ARG Add a build argument (format: KEY=VALUE)"
      echo -e "  --help          Show this help message"
      exit 0
      ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
done

# Display build information
echo -e "${YELLOW}Building Docker image:${NC} $IMAGE_NAME:$IMAGE_TAG"

# Move to project root directory
cd "$(dirname "$0")/.." || exit 1

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
  echo -e "${RED}Error:${NC} Dockerfile not found in project root"
  exit 1
fi

# Build the Docker image
echo -e "${YELLOW}Building image...${NC}"
docker build $BUILD_ARGS -t "$IMAGE_NAME:$IMAGE_TAG" .

# Check if build was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Successfully built image:${NC} $IMAGE_NAME:$IMAGE_TAG"
  
  # Display image information
  echo -e "\n${YELLOW}Image details:${NC}"
  docker images "$IMAGE_NAME:$IMAGE_TAG" --format "ID: {{.ID}}\nSize: {{.Size}}\nCreated: {{.CreatedSince}}"
  
  echo -e "\n${GREEN}To run the container:${NC}"
  echo -e "docker run -p 3000:3000 -e ATTIO_API_KEY=your_api_key $IMAGE_NAME:$IMAGE_TAG"
  
  echo -e "\n${GREEN}Or use docker-compose:${NC}"
  echo -e "docker-compose up -d"
else
  echo -e "${RED}❌ Failed to build image${NC}"
  exit 1
fi

exit 0