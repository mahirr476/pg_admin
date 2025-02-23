FROM node:18-alpine as builder

WORKDIR /app

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client and build
RUN npx prisma generate && \
    npm run build

FROM node:18-alpine

WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl libc6-compat

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy prisma schema
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 7000

# Run migration and start app
CMD npx prisma migrate deploy && node dist/index.js