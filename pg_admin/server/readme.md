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

   This command `npx prisma migrate status --schema=./prisma/global/schema.prisma` will show if any migrations are pending and if everything is up-to-date.

   This command `npx prisma migrate dev --schema=./prisma/global/schema.prisma` will apply all the pending migrations.
   
   **Warning**: This command `npx prisma migrate reset --schema=./prisma/global/schema.prisma` will reset the database and reapply all migrations.
   
    ```bash
   npx prisma generate --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-user-table --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-website-table --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-role-table --schema=./prisma/global/schema.prisma
   npx prisma migrate dev --name add-permissions-table --schema=./prisma/global/schema.prisma
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
| POST   | /api/v1/website               | Create a new website           |
| GET    | /api/v1/website               | Retrieve all websites          |
| GET    | /api/v1/website/:id           | Retrieve a website by its ID   |
| PUT    | /api/v1/website/:id           | Update a website by its ID     |
| POST   | /api/v1/role                  | Create a new role              |
| GET    | /api/v1/role                  | Retrieve all roles             |
| GET    | /api/v1/role/:id              | Retrieve a role by its ID      |
| PUT    | /api/v1/role/:id              | Update a role by its ID        |
| POST   | /api/v1/permission            | Create a new permission        |
| GET    | /api/v1/permission            | Retrieve all permission        |
| GET    | /api/v1/permission/:id        | Retrieve a permission by its ID|
| PUT    | /api/v1/permission/:id        | Update a permission by its ID  |


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
**Create a Role**

1. **URL**: `http://localhost:7000/api/v1/role`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "name": "Admin",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Role created successfully",
         "website": {
            "id": 1,
            "name": "Admin",
         }
      }
      ```    
