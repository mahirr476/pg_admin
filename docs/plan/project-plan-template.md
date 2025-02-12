# Project Plan Template

**Team Number:** 2

**Team Members:**
- Samsujjoha
- Pitash

## Overview:

### Project purpose or justification (UVP)
The Admin Panel is a web-based system designed to streamline the management of a user-driven platform. It focuses on providing tools for:
- **User  Management**: Add, edit, and deactivate user accounts.
- **System Monitoring**: Real-time dashboards for tracking key metrics and logs.
- **Configuration Management**: Simplify the handling of API keys and settings.

**Target Users**: Platform administrators and moderators.

**Uniqueness**: The system combines scalability, user-friendly design, and robust security for an efficient admin experience.

### Key Features and Benefits:
- Secure authentication.
- Intuitive dashboard with visualized data.
- Modular architecture for easy scalability.

### High-level project description and boundaries

### Minimum Viable Product (MVP):
- Add, edit, deactivate, and delete users & User authentication.
- Basic user CRUD operations.
- Real-time system monitoring.
- Settings and API key management.
   
### Technologies:
- **Frontend**: React/Next.js with TypeScript and Tailwind CSS.
- **Backend**: Node.js with Express.js and TypeScript.
- **Database**: PostgreSQL using Prisma ORM.
- **Security**: JSON Web Tokens (JWT), bcrypt for password hashing.

### System Boundaries:
- Focused on administrative operations.

### Scope:
- Core focus is on building a functional, secure admin panel.

## Measurable Project Objectives and Success Criteria
### User Management:
- **Objectives**: Add/edit/delete users.
- **Success Criteria**: Smooth functionality.

### System Monitoring:
- **Objectives**: Real-time performance stats and logs.
- **Success Criteria**: Accurate monitoring and logging.

### Configuration Management:
- **Objectives**: Easy-to-use settings management.
- **Success Criteria**: Proper persistence of configuration changes.

### Data Analytics:
- **Objectives**: Charts/graphs for key metrics.
- **Success Criteria**: Accurate and responsive visualizations.


## Users, Usage Scenarios, and High-Level Requirements

### User Groups:

### System Administrators
- **Description**: Responsible for managing user accounts and overseeing the system.
- **Tech Proficiency**: High
- **Needs**:
  - Full access to manage users and system settings.
  - Secure, reliable, and scalable interface.
- **Pain Points**:
  - Complicated interfaces and lack of real-time insights.


### Envisioned Usage

### Scenario : Adding a New User
1. **Admin Workflow**:
   - Admin logs in and navigates to "User  Management."
   - Clicks "Add User" and fills in details.
   - User is created, and confirmation is displayed.


### Requirements:

### Functional Requirements:
1. **User  Management**:
   - CRUD operations for users.
2. **System Monitoring**:
   - Dashboard with real-time logs and activity tracking.
3. **Configuration**:
   - API keys and general system settings.
4. **Authentication**:
   - JWT-based login and session handling.

### Non-Functional Requirements:
1. **Security**:
   - Password hashing (bcrypt).
   - JWT with role-based middleware.
2. **Performance**:
   - Response time <500ms.
3. **Usability**:
   - Mobile and desktop responsive design.
4. **Maintainability**:
   - Modular code with clear documentation.

### User Requirements:
- **Admins**: Manage users, monitor logs, and update configurations.

### Technical Requirements:
1. **Frontend**:
   - Framework: Next.js with TypeScript.
   - Styling: Shadcn, Tailwind CSS.
2. **Backend**:
   - Framework: Express.js with TypeScript.
   - Security: JWT for authentication, bcrypt for hashing.
3. **Database**:
   - PostgreSQL with Prisma ORM.
4. **Testing**:
   - Tools: Jest and React Testing Library.
5. **Deployment**:
   - cPanel or Azure.

## Tech Stack
| Component | Technology | Justification |
| --- | --- | --- |
| Frontend |React/Next.js| Component-based, scalable, and SEO-friendly.|
| Styling | Tailwind CSS | Utility-first, responsive design. | 
| Backend | Node/Express.js| Lightweight and efficient server-side framework. | 
| Database | PostgreSQL| Reliable relational database for structured data. | 
| ORM | Prisma| Easy-to-use, TypeScript-compatible database management. | 
| Authentication | JWT, bcrypt| Secure authentication and role-based access. | 

### High-Level Risks
| Risk | Mitigation Strategy |
| --- | --- | 
| Data security breach | Use strong password hashing and enforce HTTPS.|
| Scalability issues | Optimize database queries and implement load balancing. | 


# Assumptions and Constraints

### Assumptions:
- Admins are tech-savvy and require detailed data views.
- System will grow to handle more user roles in the future.

### Constraints:
- Limited time for advanced analytics.
  

### Summary Milestone Schedule

| Milestone | Deliverable | Deadline |
| --- | --- | --- |
| Setup | Backend and frontend initialized.| Feb 06th-07th |
| User Management | CRUD operations for users.| Feb 08th-10th |
| Admin Panel Module | Admin panel all module.| Feb 11th- Feb-28th |
| Frontend Part | Data fetching from server. | March 01th-08th |
| Testing and Fixes | Unit tests and bug fixes | March 09th-15th |
| Deployment | Deploy frontend and backend | March 15th-18th |

### Teamwork Planning and Anticipated Hurdles

| Category | Samsujjoha | Pitash |
| --- | --- | --- |
| Experience | React.js, Next.js, Bootstrap, HTML5/CSS, Tailwind, TS, PostgreSQL, jQuery | Node.js, Express.js, Bootstrap, HTML5/CSS, PHP, MySQL, PostgreSQL |
| Good At | React.js, Next.js | Node.js, Express.js | 
| Expect to Learn | Express.js, PostgreSQL | React, Docker | 


### Task Distribution

| Task Category | Samsujjoha | Pitash |
| --- | --- | --- |
| Frontend Setup | ✔️ |  |]
| Backend Setup |  | ✔️|]
| Configuration | ✔️| ✔️|]
| Testing | ✔️| ✔️|]

### Explanation of Task Distribution
1. **Frontend Tasks**: Samsujjoha will focus on UI components and user-facing functionality.
2. **Backend Tasks**: Pitash will handle the database, API, and server logic.
3. **Testing Tasks**: Shared responsibility to ensure comprehensive test coverage.