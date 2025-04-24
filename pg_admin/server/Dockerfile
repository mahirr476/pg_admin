


# Stage 1: Build
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Install dependencies
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files
# COPY package*.json ./
# COPY tsconfig.json ./

# # Install dependencies
# RUN npm install

# # Copy source code and Prisma schema
# COPY . .

# # Generate Prisma Client and build the application
# RUN npx prisma generate --schema=./prisma/global/schema.prisma && npm run build

# # Stage 2: Final Image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Install OpenSSL
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files and install production dependencies
# COPY package*.json ./
# RUN npm install --only=production

# # Copy Prisma schema
# COPY prisma/global/schema.prisma ./prisma/global/schema.prisma
# RUN npx prisma generate --schema=./prisma/global/schema.prisma

# # Copy built files from builder stage
# COPY --from=builder /app/dist ./dist

# # Expose port
# EXPOSE 7000

# # Start the application
# CMD sleep 10 && \
#     printenv && \
#     npx prisma migrate deploy --schema=./prisma/global/schema.prisma && \
#     node dist/index.js



# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Install dependencies
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files
# COPY package*.json ./
# COPY tsconfig.json ./

# # Install dependencies including development dependencies
# RUN npm install

# # Install development tools
# RUN npm install -g nodemon ts-node

# # Copy Prisma schema
# COPY prisma/ ./prisma/

# # Generate Prisma client
# RUN npx prisma generate --schema=./prisma/global/schema.prisma

# # Copy source code
# COPY src/ ./src/

# # Expose port
# EXPOSE 7000



FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies including development dependencies
RUN npm install
RUN npm install object-assign

# Install development tools
RUN npm install -g nodemon ts-node

# Copy Prisma schemas
COPY prisma/ ./prisma/

# Copy nodemon configuration
COPY nodemon.json ./

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 7000

# Set proper node environment for better file watching
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000
ENV NODE_ENV=development