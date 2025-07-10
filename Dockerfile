FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY src ./src

# Build the application
RUN npm run build

# Remove dev dependencies and source files
RUN npm prune --production && \
    rm -rf src tsconfig.json

# Create a non-root user
RUN useradd -m -u 1001 mcpuser && \
    chown -R mcpuser:mcpuser /app

USER mcpuser

# The MCP server will run on stdio
ENTRYPOINT ["node", "dist/index.js"]