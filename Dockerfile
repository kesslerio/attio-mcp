FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# Skip hooks setup in builder stage too
RUN npm config set ignore-scripts true && npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create a non-root user
RUN addgroup -S attio && \
    adduser -S attio -G attio

# Copy package files and install production dependencies only
COPY package*.json ./
# Skip hooks setup in production
RUN npm config set ignore-scripts true && npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Use non-root user for better security
USER attio

# Expose the port the server will run on
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]