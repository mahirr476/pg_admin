# # client/Dockerfile
# # FROM node:18-alpine

# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install
# # COPY . .

# # EXPOSE 3000
# # CMD ["npm", "run", "dev"]


# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm install

# # Set environment variables for hot reloading
# ENV WATCHPACK_POLLING=true
# ENV CHOKIDAR_USEPOLLING=true
# ENV CHOKIDAR_INTERVAL=1000
# ENV NODE_ENV=development
# ENV NEXT_TELEMETRY_DISABLED=1
# ENV NEXT_TURBO_POLL_INTERVAL=1000
# ENV NEXT_WEBPACK_USEPOLLING=1

# # Copy source code - this will be overridden by volume mount
# # but ensures the container has initial files
# COPY . .

# # Expose port
# EXPOSE 3000

# # Start the application with automatic refresh
# CMD ["npm", "run", "dev"]





FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Set environment variables for hot reloading
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TURBO_POLL_INTERVAL=1000
ENV NEXT_WEBPACK_USEPOLLING=1

# Copy source code - this will be overridden by volume mount
# but ensures the container has initial files
COPY . .

# Expose port
EXPOSE 3000

# Start the application with automatic refresh
CMD ["npm", "run", "dev"]