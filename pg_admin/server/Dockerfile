# FROM node:18-alpine as builder

# WORKDIR /app

# # Install OpenSSL and other required dependencies
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files
# COPY package*.json ./
# COPY tsconfig.json ./

# # Install dependencies
# RUN npm install

# # Copy source code and prisma schema
# COPY . .

# # Generate Prisma Client and build
# # RUN npx prisma generate && \
# RUN npx prisma generate --schema=./prisma/global/schema.prisma && \
#     npm run build

# FROM node:18-alpine

# WORKDIR /app

# # Install OpenSSL
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files and install production dependencies
# COPY package*.json ./
# RUN npm install --only=production

# # Copy prisma schema
# # COPY prisma/ ./prisma/
# # RUN npx prisma generate
# COPY prisma/global/schema.prisma ./prisma/global/schema.prisma
# RUN npx prisma generate --schema=./prisma/global/schema.prisma

# # Copy built files from builder
# COPY --from=builder /app/dist ./dist

# EXPOSE 7000

# # Run migration and start app
# # CMD npx prisma migrate deploy && node dist/index.js
# CMD npx prisma migrate deploy --schema=./prisma/global/schema.prisma && node dist/index.js




# # Stage 1: Build
# FROM node:18-alpine as builder

# WORKDIR /app

# # Install OpenSSL and other required dependencies
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files
# COPY package*.json ./
# COPY tsconfig.json ./

# # Install dependencies
# RUN npm install

# # Copy source code and prisma schema
# COPY . .

# # Generate Prisma Client and build
# RUN npx prisma generate --schema=./prisma/global/schema.prisma && \
#     npm run build

# # Stage 2: Production
# FROM node:18-alpine

# WORKDIR /app

# # Install OpenSSL
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files and install production dependencies
# COPY package*.json ./
# RUN npm install --only=production

# # Copy built files from builder
# COPY --from=builder /app/dist ./dist

# # Copy Prisma schema and generate client
# COPY prisma/global/schema.prisma ./prisma/global/schema.prisma
# RUN npx prisma generate --schema=./prisma/global/schema.prisma

# EXPOSE 7000

# # Run migration and start app
# # CMD npx prisma migrate deploy --schema=./prisma/global/schema.prisma && node dist/index.js
# CMD env && npx prisma migrate deploy --schema=./prisma/global/schema.prisma && node dist/index.js



# FROM node:18-alpine as builder

# WORKDIR /app

# # Install OpenSSL and other required dependencies
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files
# COPY package*.json ./ 
# COPY tsconfig.json ./

# # Install dependencies
# RUN npm install

# # Copy source code and prisma schema
# COPY . .

# # Generate Prisma Client and build
# RUN npx prisma generate --schema=./prisma/global/schema.prisma && npm run build

# FROM node:18-alpine

# WORKDIR /app

# # Install OpenSSL
# RUN apk add --no-cache openssl libc6-compat

# # Copy package files and install production dependencies
# COPY package*.json ./
# RUN npm install --only=production

# # Copy prisma schema
# COPY prisma/global/schema.prisma ./prisma/global/schema.prisma
# RUN npx prisma generate --schema=./prisma/global/schema.prisma

# # Copy built files from builder
# COPY --from=builder /app/dist ./dist

# EXPOSE 7000

# # Run migration and start app
# CMD sleep 10 && npx prisma migrate deploy --schema=./prisma/global/schema.prisma && node dist/index.js


# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code and Prisma schema
COPY . .

# Generate Prisma Client and build the application
RUN npx prisma generate --schema=./prisma/global/schema.prisma && npm run build

# Stage 2: Final Image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl libc6-compat

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy Prisma schema
COPY prisma/global/schema.prisma ./prisma/global/schema.prisma
RUN npx prisma generate --schema=./prisma/global/schema.prisma

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 7000

# Start the application
CMD sleep 10 && \
    printenv && \
    npx prisma migrate deploy --schema=./prisma/global/schema.prisma && \
    node dist/index.js
