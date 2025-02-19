## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```   

3. Start the development environment:
    ```bash
   npm run dev
   ```

4. Run database migrations:
    ```bash
   npx prisma generate --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-user-table --schema=./prisma/global/schema.prisma
   ```


## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```



