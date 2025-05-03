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

   This command `npx prisma generate --schema=./prisma/parasole/schema.prisma` will prisma generate .
   This command `npx prisma migrate dev --schema=./prisma/global/schema.prisma` will apply all the pending migrations.
   
   **Warning**: In a separate terminal, run the Prisma commands.
   
    ```bash
   docker-compose exec server npx prisma generate --schema=./prisma/group/schema.prisma
   docker-compose exec server npx prisma migrate dev --schema=./prisma/group/schema.prisma
   docker exec -it pg_admin-server-1 npx prisma migrate dev --schema=./prisma/group/schema.prisma --name add-hero-table
   ```

   **Warning**: Need some docker commands.
   ```bash
   pg_admin\pg_admin> docker exec -it pg_admin-server-1 sh -c "ls -la /app/public/uploads/group"
   \pg_admin\pg_admin> docker exec -it pg_admin-server-1 sh
   /app # cd /app/src/public/uploads/group/about
   pg_admin\pg_admin> docker exec -it pg_admin-postgres_group-1 psql -U admin -d groupdb
   groupdb=# TRUNCATE TABLE "ModelName" RESTART IDENTITY;
   groupdb=# TRUNCATE TABLE "ModelName" RESTART IDENTITY CASCADE;
   
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
| POST   | /api/v1/group/about                  | Create/Update about                        |
| GET    | /api/v1/group/about                  | Retrieve about                             |
| POST   | /api/v1/group/csr                    | Create a new CSR                           |
| GET    | /api/v1/group/csr                    | Retrieve all CSR                           |
| POST   | /api/v1/group/csr/detail             | Create a new CSR Detail                    |
| GET    | /api/v1/group/csr/detail             | Retrieve all CSR Detail Retrive            |
| POST   | /api/v1/group/milestone              | Create a new milestone                     |
| GET    | /api/v1/group/milestone              | Retrieve all milestone                     |
| PUT    | /api/v1/group/milestone/id           | Update a milestone by its ID               |
| DELETE | /api/v1/group/milestone/id           | Delete a milestone by its ID               |
| POST   | /api/v1/group/milestone/detail       | Create a new milestone detail              |
| GET    | /api/v1/group/milestone/detail       | Retrieve all milestone detail              |
| PUT    | /api/v1/group/milestone/detail/id    | Update a milestone detail by its ID        |
| DELETE | /api/v1/group/milestone/detail/id    | Delete a milestone detail by its ID        |
| POST   | /api/v1/group/business               | Create a new Business                      |
| GET    | /api/v1/group/business               | Retrieve all Business                      |
| PUT    | /api/v1/group/business/id            | Update a Business by its ID                |
| DELETE | /api/v1/group/business/id            | Delete a Business by its ID                |
| POST   | /api/v1/group/business/operation     | Create a new Business Operation            |
| GET    | /api/v1/group/business/operation     | Retrieve all Business Operation            |
| PUT    | /api/v1/group/business/operation/id  | Update a Business Operation by its ID      |
| DELETE | /api/v1/group/business/operation/id  | Delete a Business Operation by its ID      |
| POST   | /api/v1/group/business/product       | Create a new Business Product              |
| GET    | /api/v1/group/business/product       | Retrieve all Business Product              |
| PUT    | /api/v1/group/business/product/id    | Update a Business Product by its ID        |
| DELETE | /api/v1/group/business/product/id    | Delete a Business Product by its ID        |
| POST   | /api/v1/group/business/unit          | Create a new Business Unit                 |
| GET    | /api/v1/group/business/unit          | Retrieve all Business Unit                 |
| PUT    | /api/v1/group/business/unit/id       | Update a Business Unit by its ID           |
| DELETE | /api/v1/group/business/unit/id       | Delete a Business Unit by its ID           |
| POST   | /api/v1/group/business/certification     | Create a new Business Certification          |
| GET    | /api/v1/group/business/certification/id  | Retrieve a Business Certification by its ID  |
| PUT    | /api/v1/group/business/certification/id  | Update a Business Certification by its ID    |
| DELETE | /api/v1/group/business/certification/id  | Delete a Business Certification by its ID    |
| GET    | /api/v1/group/business/certification     | Retrieve all Business Certification          |
| POST   | /api/v1/group/companies               | Create a new Companies                    |
| GET    | /api/v1/group/companies               | Retrieve all Companies                    |
| GET    | /api/v1/group/companies/id            | Retrieve a Companies by its ID            |
| PUT    | /api/v1/group/companies/id            | Update a Companies by its ID              |
| DELETE | /api/v1/group/companies/id            | Delete a Companies by its ID              |
| POST   | /api/v1/group/media                   | Create a new Media                        |
| GET    | /api/v1/group/media                   | Retrieve all Media                        |
| PUT    | /api/v1/group/media/id                | Update a Media by its ID                  |
| DELETE | /api/v1/group/media/id                | Delete a Media by its ID                  |
| POST   | /api/v1/group/media/gallery           | Create a new Media Video Gallery          |
| GET    | /api/v1/group/media/gallery           | Retrieve all Media Video Gallery          |
| PUT    | /api/v1/group/media/gallery/id        | Update a Media Video Gallery by its ID    |
| DELETE | /api/v1/group/media/gallery/id        | Delete a Media Gallery by its ID          |
| POST   | /api/v1/group/media/news              | Create a new Media News                   |
| GET    | /api/v1/group/media/news              | Retrieve all Media News                   |
| PUT    | /api/v1/group/media/news/id           | Update a Media News by its ID             |
| DELETE | /api/v1/group/media/news/id           | Delete a Media News by its ID             |
| POST   | /api/v1/group/media/inquery           | Create or Update a Media inquery          |
| GET    | /api/v1/group/media/inquery           | Retrieve all Media inquery                |
| GET    | /api/v1/group/media/contact           | Retrieve all Media Contact                |
| DELETE | /api/v1/group/media/contact/id        | Delete a Media Contact by its ID          |
| POST   | /api/v1/group/contat                  | Create or Update a Contat Us              |
| GET    | /api/v1/group/contat                  | Retrieve all Contat Us                    |
| GET    | /api/v1/group/contact-form            | Retrieve all Contact Us Form Data         |
| DELETE | /api/v1/group/contact-form/id         | Delete a Contact Us Form Data by its ID   |


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


**Create/Update About**

1. **URL**: `http://localhost:7000/api/v1/group/about`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Sample Title",
      "description": "Sample Description",
      "image": "uploads/group/about/image-1742202870880-423006679.jpg",
      "mission": "t",
      "vision": "t",
      "commitedTitle": "t",
      "commitedDescrip": "t",
      "about": "t",
      "greenMission": "t",
      "extraField": "",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "About information updated successfully",
         "data": {
            "id": 1,
            "title": "Sample Title",
            "description": "Sample Description",
            "image": "uploads/group/about/image-1742202870880-423006679.jpg",
            "mission": "t",
            "vision": "t",
            "commitedTitle": "t",
            "commitedDescrip": "t",
            "about": "t",
            "greenMission": "t",
            "extraField": "",
            "createdBy": "Super Admin",
            "createdAt": "March 17, 2025 at 1:37 PM",
            "updatedBy": "N/A",
            "updatedAt": "March 17, 2025 at 3:29 PM",
            "imageUrl": "/uploads/group/about/image-1742202870880-423006679.jpg"
         }
      }
      ```

**Create a CSR**

1. **URL**: `http://localhost:7000/api/v1/group/csr`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "Leading the Way",
      "orderIndex": 1,
      "description": "A conglomerate committed"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "CSR item created successfully",
         "data": {
            "id": 1,
            "orderIndex": 1,
            "title": "Leading the Way",
            "description": "A conglomerate committed",
            "createdBy": "Super Admin",
            "createdAt": "March 20, 2025 at 3:55 PM",
            "updatedBy": "N/A",
            "updatedAt": "2025-03-20T09:55:44.121Z",
            "status": "ACTIVE"
         }
      }
      ```

**Create a CSR Detail**

1. **URL**: `http://localhost:7000/api/v1/group/csr/detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "csr_id": 1,
      "title": "School Feeding",
      "description": "Providing nutritious meals and snacks for village schools"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "CSR Detail created successfully",
         "data": {
            "id": 1,
            "csr_id": 1,
            "title": "School Feeding",
            "description": "Providing nutritious meals and snacks for village schools",
            "image": null,
            "createdBy": "Super Admin",
            "createdAt": "March 20, 2025 at 3:55 PM",
            "updatedBy": "N/A",
            "updatedAt": "2025-03-20T09:55:44.121Z",
         }
      }
      ```

**Create a new Milestone**

1. **URL**: `http://localhost:7000/api/v1/group/milestone`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "Journey",
      "description": "1989 to Today: A Story of Growth, Innovation, and Excellence",
      "orderIndex": 1,
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Milestone created successfully",
         "data": {
            "id": 1,
            "title": "Journey",
            "description": "1989 to Today: A Story of Growth, Innovation, and Excellence",
            "orderIndex": 1,
            "createdBy": "Super Admin",
            "createdAt": "March 20, 2025 at 3:55 PM",
            "updatedBy": "N/A",
            "updatedAt": "2025-03-20T09:55:44.121Z",
         }
      }
      ```


**Create a new Milestone Detail**

1. **URL**: `http://localhost:7000/api/v1/group/milestone/detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "year": "1990",
      "title": "POULTRY CARE LABORATORIES",
      "description": "Introducing on of the first private laboratory to control the quality, health and safety of the birds.",
      "image": "public/uploads/group/milestone/1742697227941-593093244.png",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Milestone detail created successfully",
         "data": {
            "id": 1,
            "year": "1990",
            "title": "POULTRY CARE LABORATORIES",
            "description": "Introducing on of the first private laboratory to control the quality, health and safety of the birds.",
            "image": "public/uploads/group/milestone/1742697227941-593093244.png",
            "status": "ACTIVE",
            "createdBy": "Super Admin",
            "createdAt": "March 23, 2025 at 8:33 AM",
            "updatedBy": "N/A",
            "updatedAt": "March 23, 2025 at 8:33 AM",
         }
      }
      ```


**Create a new Business**

1. **URL**: `http://localhost:7000/api/v1/group/business`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Poultry Farming",
      "bannerImage": "public/uploads/group/business/banner/1742723751347-859414272.png",
      "shortDes": "We serve our farmers across the nation",
      "longDes": "Established in 1993, Paragon Poultry is one of the top three poultry farmers in Bangladesh.",
      "videoLink": "https://www.youtube.com/watch?v=rSmBODrhvmE&ab_channel=ParagonGroup",
      "image": "public/uploads/group/business/image/1742722768810-71953940.jpg"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Business created successfully",
         "data": {
            "id": 1,
            "title": "Poultry Farming",
            "bannerImage": "public/uploads/group/business/banner/1742723751347-859414272.png",
            "slug": "poultry_farming",
            "shortDes": "We serve our farmers across the nation",
            "longDes": "Established in 1993, Paragon Poultry is one of the top three poultry farmers in Bangladesh.",
            "videoLink": "https://www.youtube.com/watch?v=rSmBODrhvmE&ab_channel=ParagonGroup",
            "image": "public/uploads/group/business/image/1742722768810-71953940.jpg",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "March 24, 2025 at 3:55 PM",
            "updatedBy": "N/A",
            "updatedAt": null,
            "bannerImageUrl": "/public/uploads/group/business/banner/1742723751347-859414272.png",
            "imageUrl": null
         }
      }
      ```

**Create a new Business Operation**

1. **URL**: `http://localhost:7000/api/v1/group/business/operation`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "businessId": 1,
      "title": "Business Operations",
      "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Business operation created successfully",
         "data": {
            "id": 1,
            "businessId": 1,
            "title": "Business Operations",
            "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "March 25, 2025 at 12:55 PM",
            "updatedBy": "N/A",
            "updatedAt": null
         }
      }
      ```

**Create a new Business Product**

1. **URL**: `http://localhost:7000/api/v1/group/business/product`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "businessId": 1,
      "title": "Business Product",
      "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Business operation created successfully",
         "data": {
            "id": 1,
            "businessId": 1,
            "title": "Business Product",
            "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "March 25, 2025 at 12:55 PM",
            "updatedBy": "N/A",
            "updatedAt": null
         }
      }
      ```

**Create a new Business Unit**

1. **URL**: `http://localhost:7000/api/v1/group/business/unit`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "businessId": 1,
      "title": "Business Unit",
      "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Business operation created successfully",
         "data": {
            "id": 1,
            "businessId": 1,
            "title": "Business Unit",
            "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "March 25, 2025 at 12:55 PM",
            "updatedBy": "N/A",
            "updatedAt": null
         }
      }
      ```

**Create a new Business Certification**

1. **URL**: `http://localhost:7000/api/v1/group/business/certification`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "businessId": 1,
      "title": "Business Certification",
      "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity",
      "image": "public/uploads/group/business/certification/1742722768810-71953940.jpg"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Business Certification created successfully",
         "data": {
            "id": 1,
            "businessId": 1,
            "title": "Business Certification",
            "description": "Breeder Units: Paragon Group establish 09 Parent Stock farms with a stocking capacity",
            "image": "public/uploads/group/business/certification/1742722768810-71953940.jpg",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "March 25, 2025 at 12:55 PM",
            "updatedBy": "N/A",
            "updatedAt": null
         }
      }
      ```

**Create a new Company**

1. **URL**: `http://localhost:7000/api/v1/group/companies`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Aqua Breeders",
      "shortDes": "Aqua Breeders Limited is a subsidiary of the Paragon Group",
      "image": "public/uploads/group/companies/1742722768810-71953940.jpg",
      "longDes": "Aqua Breeders Limited is a market leader in the Bangladesh aquaculture industry and continues",
      "founded": "2015",
      "teamSize": "200+",
      "location": "Bangladesh",
      "category": "Aquaculture",
      "globalPresence": "10+ Countries",
      "revenue": "$502M+",
      "clientSatisfaction": "98%",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Companies created successfully",
         "data": {
            "id": 1,
            "title": "Aqua Breeders",
            "slug": "aqua-breeders",
            "image": "public/uploads/group/companies/images/1743836608280-161563366.jpg",
            "shortDes": "Aqua Breeders Limited is a subsidiary of the Paragon Group",
            "longDes": "Aqua Breeders Limited is a market leader in the Bangladesh aquaculture industry and continues",
            "founded": "2015",
            "teamSize": "200+",
            "location": "Bangladesh",
            "category": "Aquaculture",
            "globalPresence": "10+ Countries",
            "revenue": "$502M+",
            "clientSatisfaction": "98%",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "April 5, 2025 at 1:03 PM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```

**Create a new Media**

1. **URL**: `http://localhost:7000/api/v1/group/media`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "Media Center",
      "orderIndex":1,
      "description": "Stay updated with the latest news, press releases, and media coverage",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Media created successfully",
         "data": {
            "id": 1,
            "title": "Media Center",
            "orderIndex": 1,
            "description": "Stay updated with the latest news, press releases, and media coverage",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "April 6, 2025 at 9:14 AM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```

**Create a new Media Gallery**

1. **URL**: `http://localhost:7000/api/v1/group/media/gallery`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Corporate Overview",
      "description": "An overview of Paragon Group's operations",
      "link":"https://youtu.be/vMwittQw-58?si=D1ms6BQUKBh5Ca6M",
      "image": "public/uploads/group/media/gallery/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Media created successfully",
         "data": {
            "id": 1,
            "title": "Corporate Overview",
            "slug": "corporate-overview",
            "description": "An overview of Paragon Group's operations",
            "image": "public/uploads/group/media/gallery/1743914107517-488953228.jpg",
            "link": "https://youtu.be/vMwittQw-58?si=D1ms6BQUKBh5Ca6M",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "April 6, 2025 at 10:35 AM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```

**Create a new Media News**

1. **URL**: `http://localhost:7000/api/v1/group/media/news`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Paragon Group's Innovative",
      "description": "The leading conglomerate sets new...",
      "image": "public/uploads/group/media/news/1742722768810-71953940.jpg",
      "link":"https://www.prothomalo.com/sports/football/lxz7yusu53",
      "tag":"Prothom Alo",
      "date":"January 3, 2025",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Media News created successfully",
         "data": {
            "id": 1,
            "title": "Paragon Group's Innovative",
            "description": "The leading conglomerate sets new...",
            "image": "public/uploads/group/media/news/1743922256929-119804158.png",
            "link": "https://www.prothomalo.com/sports/football/lxz7yusu53",
            "tag": "Prothom Alo",
            "date": "January 3, 2025",
            "slug": "paragon-groups-innovative",
            "createdBy": "Super Admin",
            "status": "ACTIVE",
            "createdAt": "April 6, 2025 at 12:50 PM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```

**Create or Update Media Inquery**

1. **URL**: `http://localhost:7000/api/v1/group/media/inquery`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "Media Inquiries",
      "description": "For press and media related inquiries, please contact our media",
      "email": "media@paragongroup.com.bd",
      "contactNo": "+880 123 456 7890",
      "website": "www.paragongroup.com.bd"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Media inquiry created successfully",
         "data": {
            "id": 1,
            "title": "Media Inquiries",
            "description": "For press and media related inquiries, please contact our media relations team or fill out the form.",
            "email": "media@paragongroup.com.bd",
            "contactNo": "+880 123 456 7890",
            "website": "www.paragongroup.com.bd",
            "createdBy": "Super Admin",
            "createdAt": "April 6, 2025 at 3:18 PM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```      


**Create or Update Media Contact**

1. **URL**: `http://localhost:7000/api/v1/group/media/contact`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "name":"Media Inquiries",
      "organization":"team or fill out the form.",
      "email": "media@paragongroup.com.bd",
      "phone": "+8801521473703",
      "type": "www.paragongroup.com.bd",
      "message": "For press and media related inquiries, please contact our media relations"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Thank you for your message. We will contact you soon.",
      }
      ``` 

**Create or Update Media Inquery**

1. **URL**: `http://localhost:7000/api/v1/group/media/inquery`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "Media Inquiries",
      "description": "For press and media related inquiries, please contact our media",
      "email": "media@paragongroup.com.bd",
      "contactNo": "+880 123 456 7890",
      "website": "www.paragongroup.com.bd"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Media inquiry created successfully",
         "data": {
            "id": 1,
            "title": "Media Inquiries",
            "description": "For press and media related inquiries, please contact our media relations team or fill out the form.",
            "email": "media@paragongroup.com.bd",
            "contactNo": "+880 123 456 7890",
            "website": "www.paragongroup.com.bd",
            "createdBy": "Super Admin",
            "createdAt": "April 6, 2025 at 3:18 PM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```      

**Create or Update Contact Us**

1. **URL**: `http://localhost:7000/api/v1/group/contact`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title":"Contact Us",
      "description1":"We’re here to assist you! Whether you have questions, need support.",
      "location": "Paragon House, 5 Mohakhali C/A Dhaka 1212, Bangladesh",
      "phone": "+88 02 9882107-8",
      "email": "info@paragongroup-bd.com",
      "workingHour": "Saturday - Thursday: 8:30 AM - 5:30 PM Friday: Closed"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Contact information created successfully",
         "data": {
            "id": 1,
            "title": "Contact Us",
            "description1": "We’re here to assist you! Whether you have questions, need support.",
            "description2": "",
            "location": "Paragon House, 5 Mohakhali C/A Dhaka 1212, Bangladesh",
            "phone": "+88 02 9882107-8",
            "email": "info@paragongroup-bd.com",
            "workingHour": "Saturday - Thursday: 8:30 AM - 5:30 PM Friday: Closed",
            "googleMap": "",
            "facebook": "",
            "instagram": "",
            "twitter": "",
            "linkedin": "",
            "createdBy": "Super Admin",
            "createdAt": "April 7, 2025 at 9:54 AM",
            "updatedBy": null,
            "updatedAt": null
         }
      }
      ```       
 


## API Endpoints For Paragon Group Website


| METHOD | ENDPOINT                      | DESCRIPTION                                          | 
|--------|-------------------------------|------------------------------------------------------|      
| GET    | /api/v1/pg/home               | Retrieve all conent for Homepage                     |
| GET    | /api/v1/pg/about-us           | Retrieve all conent for About Us Page                |
| GET    | /api/v1/pg/about-csr          | Retrieve all conent for CSR Page                     |
| GET    | /api/v1/pg/milestone          | Retrieve all conent for Milestone Page               |
| GET    | /api/v1/pg/business           | Retrieve all Business for Business Activities Page   |
| GET    | /api/v1/pg/business/slug      | Retrieve Business Detail realted information         |
| GET    | /api/v1/pg/companies          | Retrieve all Companies for Companies Page            |
| GET    | /api/v1/pg/companies/slug     | Retrieve Companies Detail realted information        |
| GET    | /api/v1/pg/companies          | Retrieve all Companies for Companies Page            |
| GET    | /api/v1/pg/media              | Retrieve all Companies for Companies Page            |
| POST   | /api/v1/pg/media/contact      | Create a New Media Contact Form                      |
| GET    | /api/v1/pg/contact-us         | Retrieve Contact Us Related Information              |
| POST   | /api/v1/pg/contact-form       | Create a New Contact Us Form                         |



**Create Contact Us Form**

1. **URL**: `http://localhost:7000/api/v1/pg/contact-form`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "name":"Hello Xammp",
      "organization":"Paragon",
      "email": "Paragon@gmail.com",
      "phone": "+8802 9882107-8",
      "message": "We’re here to assist you! Whether you have questions, need support"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Thank you for your message. We will contact you soon.",
      }
      ``` 


**Create Media Contact Form**

1. **URL**: `http://localhost:7000/api/v1/pg/media/contact`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "name":"Media Inquiries",
      "organization":"team or fill out the form.",
      "email": "media@paragongroup.com.bd",
      "phone": "+8801521473703",
      "type": "www.paragongroup.com.bd",
      "message": "For press and media related inquiries, please contact our media relations"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Thank you for your message. We will contact you soon.",
      }
      ```   


## API Endpoints For Parasole Panel

| METHOD | ENDPOINT                             | DESCRIPTION                                      | 
|--------|----------------------------------------|------------------------------------------------|
| POST   | /api/v1/parasole/hero                  | Create a new hero                              |
| GET    | /api/v1/parasole/hero                  | Retrieve all hero                              |
| GET    | /api/v1/parasole/hero/id               | Retrieve a hero by its ID                      |
| PUT    | /api/v1/parasole/hero/id               | Update a hero by its ID                        |
| DELETE | /api/v1/parasole/hero/id               | Delete a hero by its ID                        |
| POST   | /api/v1/parasole/hero-detail           | Create a new hero detail                       |
| GET    | /api/v1/parasole/hero-detail           | Retrieve all hero detail                       |
| GET    | /api/v1/parasole/hero-detail/id        | Retrieve a hero detail by its ID               |
| PUT    | /api/v1/parasole/hero-detail/id        | Update a hero detail by its ID                 |
| DELETE | /api/v1/parasole/hero-detail/id        | Delete a hero detail by its ID                 |
| POST   | /api/v1/parasole/about                 | Create a new about                             |
| GET    | /api/v1/parasole/about                 | Retrieve all about                             |
| GET    | /api/v1/parasole/about/id              | Retrieve a about by its ID                     |
| PUT    | /api/v1/parasole/about/id              | Update a about by its ID                       |
| DELETE | /api/v1/parasole/about/id              | Delete a about by its ID                       |
| POST   | /api/v1/parasole/about-detail          | Create a new about detail                      |
| GET    | /api/v1/parasole/about-detail          | Retrieve all about detail                      |
| GET    | /api/v1/parasole/about-detail/id       | Retrieve a about detail by its ID              |
| PUT    | /api/v1/parasole/about-detail/id       | Update a about detail by its ID                |
| DELETE | /api/v1/parasole/about-detail/id       | Delete a about detail by its ID                |
| POST   | /api/v1/parasole/compliance            | Create a new compliance                        |
| GET    | /api/v1/parasole/compliance            | Retrieve all compliance                        |
| GET    | /api/v1/parasole/compliance/id         | Retrieve a compliance by its ID                |
| PUT    | /api/v1/parasole/compliance/id         | Update a compliance by its ID                  |
| DELETE | /api/v1/parasole/compliance/id         | Delete a compliance by its ID                  |
| POST   | /api/v1/parasole/compliance-detail         | Create a new compliance detail             |
| GET    | /api/v1/parasole/compliance-detail         | Retrieve all compliance detail             |
| GET    | /api/v1/parasole/compliance-detail/id      | Retrieve a compliance detail by its ID     |
| PUT    | /api/v1/parasole/compliance-detail/id      | Update a compliance detail by its ID       |
| DELETE | /api/v1/parasole/compliance-detail/id      | Delete a compliance detail by its ID       |
| POST   | /api/v1/parasole/operation             | Create a new operation                         |
| GET    | /api/v1/parasole/operation             | Retrieve all operation                         |
| GET    | /api/v1/parasole/operation/id          | Retrieve a operation by its ID                 |
| PUT    | /api/v1/parasole/operation/id          | Update a operation by its ID                   |
| DELETE | /api/v1/parasole/operation/id          | Delete a operation by its ID                   |
| POST   | /api/v1/parasole/operation-detail      | Create a new operation detail                  |
| GET    | /api/v1/parasole/operation-detail      | Retrieve all operation detail                  |
| GET    | /api/v1/parasole/operation-detail/id   | Retrieve a operation detail by its ID          |
| PUT    | /api/v1/parasole/operation-detail/id   | Update a operation detail by its ID            |
| DELETE | /api/v1/parasole/operation-detail/id   | Delete a operation detail by its ID            |
| POST   | /api/v1/parasole/buyer                 | Create a new buyer                             |
| GET    | /api/v1/parasole/buyer                 | Retrieve all buyer                             |
| GET    | /api/v1/parasole/buyer/id              | Retrieve a buyer by its ID                     |
| PUT    | /api/v1/parasole/buyer/id              | Update a buyer by its ID                       |
| DELETE | /api/v1/parasole/buyer/id              | Delete a buyer by its ID                       |
| POST   | /api/v1/parasole/buyer-detail          | Create a new buyer detail                      |
| GET    | /api/v1/parasole/buyer-detail          | Retrieve all buyer detail                      |
| GET    | /api/v1/parasole/buyer-detail/id       | Retrieve a buyer detail by its ID              |
| PUT    | /api/v1/parasole/buyer-detail/id       | Update a buyer detail by its ID                |
| DELETE | /api/v1/parasole/buyer-detail/id       | Delete a buyer detail by its ID                |
| POST   | /api/v1/parasole/contact               | Create a new contact                           |
| GET    | /api/v1/parasole/contact               | Retrieve all contact                           |
| GET    | /api/v1/parasole/contact/id            | Retrieve a contact by its ID                   |
| PUT    | /api/v1/parasole/contact/id            | Update a contact by its ID                     |
| DELETE | /api/v1/parasole/contact/id            | Delete a contact by its ID                     |
| POST   | /api/v1/parasole/contact-media         | Create a new contact media or update           |
| GET    | /api/v1/parasole/contact-media         | Retrieve all contact media                     |
| GET    | /api/v1/parasole/contact-form          | Retrieve all contact form submissions          |
| DELETE | /api/v1/parasole/contact-form/id       | Delete a specific contact form entry by ID     |


## Testing the API for Parasole Panel

You can test the API using tools like Postman or Thunder Client (VS Code extension).


**Create a Hero**

1. **URL**: `http://localhost:7000/api/v1/parasole/hero`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Leading the Way",
      "description": "A conglomerate committed to excellence across multiple industries",
      "index": "1",
      "image": "public/uploads/parasole/hero/1742722768810-71953940.jpg",
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
            "image": "public/uploads/parasole/hero/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 24, 2025 at 3:14 PM",
            "updatedBy": "N/A",
            "updatedAt": "April 24, 2025 at 3:14 PM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a Hero Detail**

1. **URL**: `http://localhost:7000/api/v1/parasole/hero-detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "heroId": "1",
      "title": "Global Excellence",
      "description": "Global Excellence in Footwear Manufacturing",
      "index": "1",
      "image": "public/uploads/parasole/hero-detail/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Hero detail created successfully",
         "data": {
            "id": 1,
            "heroId": 1,
            "title": "Global Excellence",
            "description": "Global Excellence in Footwear Manufacturing",
            "image": "public/uploads/parasole/hero-detail/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 26, 2025 at 10:44 AM",
            "updatedBy": "Super Admin",
            "updatedAt": "April 26, 2025 at 12:03 PM",
            "status": "ACTIVE"
         }
      }
      ```     

**Create a Hero**

1. **URL**: `http://localhost:7000/api/v1/parasole/about`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Our Story",
      "description": "A journey of innovation and excellence",
      "index": "1",
      "image": "public/uploads/parasole/about/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "About created successfully",
         "data": {
            "id": 1,
            "title": "Our Story",
            "description": "A journey of innovation and excellence",
            "image": "public/uploads/parasole/about/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 28, 2025 at 9:44 AM",
            "updatedBy": "N/A",
            "updatedAt": "April 28, 2025 at 9:44 AM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a About Detail**

1. **URL**: `http://localhost:7000/api/v1/parasole/about-detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "aboutId": "1",
      "title": "Mission",
      "description": "To revolutionize footwear manufacturing through innovation",
      "index": "",
      "image": "",
      "link": "",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "About detail created successfully",
         "data": {
            "id": 1,
            "aboutId": 1,
            "title": "Mission",
            "description": "To revolutionize footwear manufacturing through innovation",
            "image": "",
            "index": "",
            "createdBy": "Super Admin",
            "createdAt": "April 28, 2025 at 2:07 PM",
            "updatedBy": null,
            "updatedAt": "April 28, 2025 at 2:07 PM",
            "status": "ACTIVE"
         }
      }
      ```           


**Create a Compliance**

1. **URL**: `http://localhost:7000/api/v1/parasole/compliance`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Standards in Compliance",
      "description": "Our commitment to maintaining the highest standards",
      "index": "1",
      "images": "public/uploads/parasole/compliance/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Compliance created successfully",
         "data": {
            "id": 1,
            "title": "Standards in Compliance",
            "description": "Our commitment to maintaining the highest standards",
            "images": "public/uploads/parasole/compliance/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 29, 2025 at 12:43 PM",
            "updatedBy": "N/A",
            "updatedAt": "April 29, 2025 at 12:43 PM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a Compliance Detail**

1. **URL**: `http://localhost:7000/api/v1/parasole/compliance-detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "complianceId": "1",
      "title": "Worker Safety",
      "description": "Prioritizing the health and safety",
      "shortDescrip": "",
      "index": "1",
      "image": "public/uploads/parasole/compliance-detail/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Compliance created successfully",
         "data": {
            "id": 1,
            "title": "Standards in Compliance",
            "description": "Our commitment to maintaining the highest standards",
            "shortDescrip": null,
            "image": "public/uploads/parasole/compliance-detail/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 29, 2025 at 12:43 PM",
            "updatedBy": "N/A",
            "updatedAt": "April 29, 2025 at 12:43 PM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a Operation**

1. **URL**: `http://localhost:7000/api/v1/parasole/operation`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Manufacturing Excellence",
      "description": "From concept to creation",
      "index": "1",
      "images": "public/uploads/parasole/operation/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Operation created successfully",
         "data": {
            "id": 1,
            "title": "Manufacturing Excellence",
            "description": "From concept to creation",
            "images": "public/uploads/parasole/operation/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 29, 2025 at 4:32 PM",
            "updatedBy": "N/A",
            "updatedAt": "April 29, 2025 at 4:32 PM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a Operation Setail**

1. **URL**: `http://localhost:7000/api/v1/parasole/operation-detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "operationId": "3",
      "title": "Merchandising",
      "description": "Negotiation with buyers",
      "index": "1",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Operation detail created successfully",
         "data": {
            "id": 1,
            "operationId": 3,
            "title": "Merchandising",
            "slug": "merchandising",
            "index": 1,
            "description": "Negotiation with buyers",
            "createdBy": "Super Admin",
            "createdAt": "April 30, 2025 at 9:57 AM",
            "updatedBy": null,
            "updatedAt": "April 30, 2025 at 9:57 AM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a Buyer**

1. **URL**: `http://localhost:7000/api/v1/parasole/buyer`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Trusted by Global",
      "description": "Building long-term partnerships through excellence",
      "index": "1",
      "image": "public/uploads/parasole/buyer/1742722768810-71953940.jpg",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Hero created successfully",
         "data": {
            "id": 1,
            "title": "Trusted by Global",
            "slug": "trusted-by-global",
            "description": "Building long-term partnerships through excellence",
            "image": "public/uploads/parasole/hero/ddd-1745486066820-10165716.jpg",
            "index": 1,
            "createdBy": "Super Admin",
            "createdAt": "April 30, 2025 at 12:38 PM",
            "updatedBy": "N/A",
            "updatedAt": "April 30, 2025 at 12:38 PM",
            "status": "ACTIVE"
         }
      }
      ```

**Create a Buyer Detail**

1. **URL**: `http://localhost:7000/api/v1/parasole/buyer-detail`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "buyerId": "1",
      "title": "Walmart",
      "description": "Long-term partnership delivering",
      "index": "1",
      "image": "public/uploads/parasole/buyer-detail/1742722768810-71953940.jpg",
      "type": "Mass Market Retail",
      "year": "2020",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Hero detail created successfully",
         "data": {
            "id": 1,
            "buyerId": 1,
            "title": "Walmart",
            "slug": "walmart",
            "index": 1,
            "description": "Long-term partnership delivering",
            "image": "public/uploads/parasole/buyer-detail/yujyu-1746001465976-676114817.jpeg",
            "type": "Mass Market Retail",
            "year": "2020",
            "createdBy": "Super Admin",
            "createdAt": "April 30, 2025 at 2:24 PM",
            "updatedBy": null,
            "updatedAt": "April 30, 2025 at 2:24 PM",
            "status": "ACTIVE"
         }
      }
      ```


**Create a Contact**

1. **URL**: `http://localhost:7000/api/v1/parasole/contact`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (form-data)**: 
  ```json
   {
      "title": "Get in Touch",
      "description": "Ready to discuss your manufacturing needs",
      "image": "public/uploads/parasole/contact/1742722768810-71953940.jpg",
      "index": "1",
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Contact created successfully",
         "data": {
            "id": 1,
            "title": "Get in Touch",
            "slug": "get-in-touch",
            "index": 1,
            "description": "Ready to discuss your manufacturing needs",
            "image": "public/uploads/parasole/contact/yujyu-1746001465976-676114817.jpeg",
            "createdBy": "Super Admin",
            "createdAt": "April 30, 2025 at 3:11 PM",
            "updatedBy": null,
            "updatedAt": "April 30, 2025 at 3:11 PM",
            "status": "ACTIVE"
         }
      }
      ```


**Create or Update Contact Media**

1. **URL**: `http://localhost:7000/api/v1/parasole/contact-media`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "title": "ShoeCo",
      "description": "Crafting premium footwear with cutting-edge",
      "facebook": "facebook",
      "instagram": "instagram",
      "twitter": "twitter",
      "linkedin": "linkedin",
      "youtube": "youtube",
      "tiktok": "tiktok",
      "telegram": "telegram",
      "email": "email",
      "phone": "phone",
      "address": "address",
      "map": "map"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "status": "success",
         "message": "Contact media saved successfully",
         "data": {
            "id": 1,
            "title": "ShoeCo",
            "description": "Crafting premium footwear with cutting-edge",
            "facebook": "facebook",
            "instagram": "instagram",
            "twitter": "twitter",
            "linkedin": "linkedin",
            "youtube": "youtube",
            "tiktok": "tiktok",
            "telegram": "telegram",
            "email": "email",
            "phone": "phone",
            "address": "address",
            "map": "map",
            "createdBy": "Super Admin",
            "createdAt": "April 30, 2025 at 4:40 PM",
            "updatedBy": "Super Admin",
            "updatedAt": "May 3, 2025 at 9:46 AM"
         }
      }
      ```

**Create Contact Form**

1. **URL**: `http://localhost:7000/api/v1/site/parasole/contact-form`
2. **Method**: `POST`
3. **Headers**: `Content-Type: application/json`
4. **Body (JSON)**: 
  ```json
   {
      "name": "ShoeCo",
      "organization": "Crafting premium",
      "email": "facebook@gmail.com",
      "phone": "01521473703",
      "type": "twitter",
      "message": "Message is too short. Please provide more details"
   }
   ```
5. **Expected Response**: 
   ```json
      {
         "success": true,
         "message": "Thank you for your message. We will contact you soon."
      }
      ```




## API Endpoints For Parasole Footware Website


| METHOD | ENDPOINT                             | DESCRIPTION                                          | 
|--------|--------------------------------------|------------------------------------------------------|      
| GET    | /api/v1/site/parasole/home           | Retrieve all conent for Home page                    |
| GET    | /api/v1/site/parasole/about          | Retrieve all conent for About Us page                |
| GET    | /api/v1/site/parasole/compliance     | Retrieve all conent for Compliance Page              |
| POST   | /api/v1/site/parasole/contact-form   | Create a new contact form for Parasole contact page  |
