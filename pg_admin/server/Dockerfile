# server/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema=./prisma/global/schema.prisma

EXPOSE 7000
CMD ["npm", "run", "dev"]