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

   Create the `src/generated/global` directory before running the commands
    ```bash
   npx prisma generate --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-user-table --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-website-table --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-role-table --schema=./prisma/global/schema.prisma
   ```


## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=7000
JWT_SECRET="paragon-global-3703"
```

## API Endpoints


| METHOD | ENDPOINT                      | DESCRIPTION                    | 
|--------|-------------------------------|--------------------------------|
| POST   | /api/v1/user/register         | Register a new user            |
| POST   | /api/v1/user/login            | Log in an existing user        |
| GET    | /api/v1/user/all              | Retrieve all users             |
| GET    | /api/v1/user/inactive-users   | Inactive users retrieved       |
| POST   | /api/v1/website               | Create a new website           |
| GET    | /api/v1/website               | Retrieve all websites          |
| PUT    | /api/v1/website/:id           | Update a website by its ID     |


## Testing the API

You can test the API using tools like Postman or Thunder Client (VS Code extension).

**Register a User**

1. **URL**: `http://localhost:7000/api/v1/user/register`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "Password123"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "User registered successfully",
         "user": {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com"
         },
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
      ```


**Log In a User**

1. **URL**: `http://localhost:7000/api/v1/user/login`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "email": "john.doe@example.com",
      "password": "Password123"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "User logged in successfully",
         "user": {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com"
         },
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
      ```

**Create a Website**

1. **URL**: `http://localhost:7000/api/v1/website`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "name": "Paragon",
      "domain": "paragon.com",
      "description": "ok"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Website created successfully",
         "website": {
            "id": 1,
            "name": "Paragon",
            "domain": "paragon.com",
            "description": "ok",
         }
      }
      ```      