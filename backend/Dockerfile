FROM node:20-alpine

WORKDIR /app

# Copy backend dependencies and install
COPY backend/package*.json ./
RUN npm install

# Copy all backend source files (server, routes, models, seed)
COPY backend/ ./

# Copy React build output (built before docker compose build)
COPY frontend/dist/ ./frontend/dist/

EXPOSE 5000

CMD ["node", "server.js"]
