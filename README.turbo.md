# Turborepo + NestJS + Next.js Monorepo

A monorepo setup using Turborepo with NestJS API backend and Next.js frontend.

## Project Structure

```
.
├── apps/
│   ├── api/          # NestJS API with repository pattern
│   └── web/          # Next.js frontend
├── packages/
│   └── shared-types/ # Shared TypeScript types
├── turbo.json        # Turborepo configuration
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Docker (for database)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Start the database:

```bash
docker compose up
```

Run all apps in development mode:

```bash
pnpm dev
```

Or run specific apps:

```bash
# API only (runs on http://localhost:4131)
pnpm --filter @repo/api dev

# Web only (runs on http://localhost:3001)
pnpm --filter @repo/web dev
```

### Building

Build all apps:

```bash
pnpm build
```

Build specific apps:

```bash
pnpm --filter @repo/api build
pnpm --filter @repo/web build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

## Apps

### API (`apps/api`)

NestJS backend with:

- TypeORM for database
- Repository pattern
- JWT authentication
- Role-based access control (RBAC)
- Swagger API documentation
- PostgreSQL database

Runs on: `http://localhost:4131`

API Docs: `http://localhost:4131/api`

### Web (`apps/web`)

Next.js 16 frontend with:

- TypeScript
- Tailwind CSS
- App Router
- ESLint

Runs on: `http://localhost:3001`

## Packages

### shared-types (`packages/shared-types`)

Shared TypeScript types and interfaces used by both API and Web applications.

## Database

PostgreSQL database runs in Docker:

- Database: `student_management`
- Port: `5433`
- User: `postgres`
- Password: `postgres`

PgAdmin:

- URL: `http://localhost:5050`
- Email: `admin@admin.com`
- Password: `admin`

## Scripts

- `pnpm dev` - Run all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm test` - Test all apps
- `pnpm format` - Format code with Prettier

## API-specific commands

```bash
# Run migrations
pnpm --filter @repo/api migration:run

# Generate migration
pnpm --filter @repo/api migration:generate

# Seed database
pnpm --filter @repo/api seed
```
