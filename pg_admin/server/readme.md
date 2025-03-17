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

   This command `docker-compose up --build` build and start the Docker containers.

   This command `npx prisma migrate dev --schema=./prisma/global/schema.prisma` will apply all the pending migrations.
   
   **Warning**: In a separate terminal, run the Prisma commands.
   
    ```bash
   docker-compose exec server npx prisma generate --schema=./prisma/group/schema.prisma
   docker-compose exec server npx prisma migrate dev --schema=./prisma/group/schema.prisma
   docker exec -it pg_admin-server-1 npx prisma migrate dev --schema=./prisma/group/schema.prisma --name add-hero-table
   ```


## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=7000
JWT_SECRET="paragon-global-3703"
```

## API Endpoints For Global Admin Panel


| METHOD | ENDPOINT                      | DESCRIPTION                           | 
|--------|-------------------------------|---------------------------------------|
| POST   | /api/v1/user/register         | Register a new user                   |
| POST   | /api/v1/user/login            | Log in an existing user               |
| GET    | /api/v1/user/all              | Retrieve all users                    |
| GET    | /api/v1/user/:id              | Retrieve a user by its ID             |
| GET    | /api/v1/user/profile          | Authenticated user profile Retrieve   |
| PUT    | /api/v1/user/profile          | Authenticated user profile updated    |
| POST   | /api/v1/user/change-password  | Authenticated user password updated   |
| PUT    | /api/v1/user/:id              | Update a user by its ID               |
| POST   | /api/v1/website               | Create a new website                  |
| GET    | /api/v1/website               | Retrieve all websites                 |
| GET    | /api/v1/website/:id           | Retrieve a website by its ID          |
| PUT    | /api/v1/website/:id           | Update a website by its ID            |
| POST   | /api/v1/role                  | Create a new role                     |
| GET    | /api/v1/role                  | Retrieve all roles                    |
| GET    | /api/v1/role/:id              | Retrieve a role by its ID             |
| PUT    | /api/v1/role/:id              | Update a role by its ID               |
| POST   | /api/v1/permission            | Create a new permission               |
| GET    | /api/v1/permission            | Retrieve all permission               |
| GET    | /api/v1/permission/:id        | Retrieve a permission by its ID       |
| PUT    | /api/v1/permission/:id        | Update a permission by its ID         |
| GET    | /api/v1/role_permission/:id   | Retrieve role_permission by its ID    |
| PUT    | /api/v1/role_permission/:id   | Update role_permission by its ID      |
| GET    | /api/v1/audit-logs            | Retrieve all audit logs               |



## Testing the API for Global Admin Panel

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

**Create a User**

1. **URL**: `http://localhost:7000/api/v1/user/create`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "Password123",
      "roleId": 1
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "User created successfully",
         "user": {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "roleId": 1
         }
      }
      ```

**Update a User**

1. **URL**: `http://localhost:7000/api/v1/user/1`
2. **Method**: `PUT`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "firstName": "John1",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "status": "ACTIVE",
      "roleId": 1
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "User updated successfully",
         "user": {
            "id": 1,
            "firstName": "John1",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "status": "ACTIVE",
            "roleId": 1
         },
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
      ```

**Authentic User Change Password**

1. **URL**: `http://localhost:7000/api/v1/user/change-password`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "currentPassword": "paragon@",
      "newPassword": "paragon@1",
      "confirmPassword": "paragon@1"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Password changed successfully"
      }
      ```

**Authentic User Profile Update**

1. **URL**: `http://localhost:7000/api/v1/user/profile`
2. **Method**: `PUT`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "firstName": "Supper",
      "lastName": "Test"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Profile updated successfully",
         "user": {
            "id": 1,
            "firstName": "Supper",
            "lastName": "Test",
         }
      }
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

**Apply role with permission**

1. **URL**: `http://localhost:7000/api/v1/role_permission/1`
2. **Method**: `PUT`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "paragon_group_view": true,
      "paragon_group_create": false,
      "paragon_group_edit": true,
      "paragon_group_delete": false,
      "parasole_view": true,
      "parasole_create": false,
      "parasole_edit": true,
      "parasole_delete": false,
      "user_view": true,
      "user_create": false,
      "user_edit": true,
      "user_delete": false,
      "settings_view": true,
      "settings_create": false,
      "settings_edit": true,
      "dashboard": true,
      "analytics_view": true
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "RolePermission upserted successfully",
         "rolePermission": {
            "id": 1,
            "paragon_group_view": true,
            "paragon_group_create": false,
            "paragon_group_edit": true,
            "paragon_group_delete": false,
            "parasole_view": true,
            "parasole_create": false,
            "parasole_edit": true,
            "parasole_delete": false,
            "user_view": true,
            "user_create": false,
            "user_edit": true,
            "user_delete": false,
            "settings_view": true,
            "settings_create": false,
            "settings_edit": true,
            "dashboard": true,
            "analytics_view": true
         }
      }
      ```

**Retrieve all audit logs**

1. **URL**: `http://localhost:7000/api/v1/audit-logs`
2. **Method**: `GET`

   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "AuditLog fetched successfully",
         "auditLogs": {
            "id": 1,
            "user_id": 1,
            "ip_address": "::ffff:172.20.0.1",
            "action": "LOGIN_SUCCESS",
            "entry_time": "2025-03-08T06:11:49.145Z",
            "previous_state": null,
            "new_state": "{\"userId\":1,\"email\":\"superadmin@example.com\",\"status\":\"ACTIVE\"}",
            "error_message": null,
            "entity_type": "Auth",
            "entity_id": null,
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "notes": null
         }
      }
      ```




## API Endpoints For Group Panel

| METHOD | ENDPOINT                             | DESCRIPTION                                | 
|--------|--------------------------------------|--------------------------------------------|
| POST   | /api/v1/group/hero                   | Create a new hero                          |
| GET    | /api/v1/group/hero                   | Retrieve all hero                          |


## Testing the API for Group Panel

You can test the API using tools like Postman or Thunder Client (VS Code extension).


**Create a Hero**

1. **URL**: `http://localhost:7000/api/v1/group/hero`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "Leading the Way",
      "description": "A conglomerate committed to excellence across multiple industries"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Hero created successfully",
         "data": {
            "id": 1,
            "title": "Leading the Way",
            "description": "A conglomerate committed to excellence across multiple industries",
            "companies": "",
            "projects": "",
            "location": "",
            "employees": "",
            "industries": "",
            "products": "",
            "established": "",
            "createdBy": "Super Admin",
            "createdAt": "2025-03-13T05:44:34.028Z",
            "updatedBy": "N/A",
            "updatedAt": "2025-03-13T05:44:34.028Z",
            "status": "ACTIVE"
         }
      }
      ```