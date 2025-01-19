# Paragon Admin Panel

A centralized administration platform built with Next.js 13+ that allows management of multiple websites from a single dashboard.

## Architecture Overview

The project follows a modular, feature-based architecture designed for scalability and maintainability.

### Directory Structure

```
pg_admin/
├── src/
│   ├── app/                    # Next.js 13 App Router structure
│   │   ├── (auth)/            # Authentication-related pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   ├── lib/                   # Core utilities and configurations
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions and constants
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

### Core Components Breakdown

#### 1. Authentication (`src/app/(auth)`)
- **Purpose**: Handles user authentication and authorization
- **Key Files**:
  - `login/page.tsx`: Login interface using shadcn/ui components
  - `layout.tsx`: Auth-specific layout wrapper

#### 2. API Routes (`src/app/api`)
- **Purpose**: Backend API endpoints
- **Structure**:
  - `auth/[...nextauth]`: NextAuth.js authentication endpoints
  - `websites/`: Website management endpoints
  - `[websiteId]/`: Website-specific endpoints

#### 3. Components (`src/components`)
```
components/
├── layout/               # Layout components
│   ├── Sidebar.tsx      # Global navigation sidebar
│   ├── Header.tsx       # Top navigation header
│   └── Navigation.tsx   # Navigation menu components
├── shared/              # Reusable UI components
│   ├── Button.tsx       # Custom button component
│   └── Card.tsx         # Card container component
└── modules/             # Feature-specific components
    └── website/         # Website management components
```

#### 4. Core Libraries (`src/lib`)
```
lib/
├── auth/                # Authentication utilities
│   ├── config.ts        # NextAuth configuration
│   └── session.ts       # Session management
├── db/                  # Database utilities
│   └── prisma.ts        # Prisma client configuration
└── api/                 # API utilities
    └── client.ts        # API client configuration
```

#### 5. Type Definitions (`src/types`)
```
types/
├── user.ts             # User-related types
├── website.ts          # Website-related types
└── module.ts           # Module-related types
```

### Database Schema (Prisma)

The database is structured around three main models:

1. **User**
   - Stores user information and authentication details
   - Links to websites they can manage
   - Includes role-based access control

2. **Website**
   - Represents individual websites in the system
   - Contains website-specific configurations
   - Links to associated modules and users

3. **Module**
   - Represents features/components of websites
   - Configurable per website
   - Includes activation status and settings

### Authentication Flow

1. User submits credentials
2. NextAuth.js validates credentials against database
3. JWT token generated with user role and permissions
4. Session maintained using JWT strategy
5. Protected routes check session validity and permissions

### Key Technologies

- **Frontend**: Next.js 13+, React, TypeScript
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Query
- **Styling**: Tailwind CSS
- **Development**: Docker for development environment

### Setup and Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development environment:
   ```bash
   docker-compose up -d
   npm run dev
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Contributing

1. if no `dev` branch exisits, create one from `init` and then create feature branches from `dev`
2. Follow TypeScript and ESLint guidelines
3. Update tests if applicable
4. Submit PR with detailed description

