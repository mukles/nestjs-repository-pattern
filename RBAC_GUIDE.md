# RBAC Authentication Implementation

This project now includes Role-Based Access Control (RBAC) with JWT authentication.

## Features

- JWT-based authentication
- Role-based authorization
- Permission-based authorization
- Protected routes
- User management
- Refresh token support

## Roles

- `SUPER_ADMIN` - Full system access
- `ADMIN` - Administrative access
- `TEACHER` - Teacher-specific access
- `STUDENT` - Student-specific access

## Setup

### 1. Install Required Dependencies

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcrypt
npm install -D @types/passport-jwt @types/passport-local @types/bcrypt
```

### 2. Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### 3. Database Migration

Run migrations to create the new tables:

```bash
npm run migration:generate -- src/migrations/add-rbac
npm run migration:run
```

### 4. Seed Initial Roles and Permissions

You'll need to create a seeder to populate initial roles and permissions in the database.

## Usage

### Authentication Endpoints

#### Register

```bash
POST /auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "roleId": 1
}
```

#### Login

```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Logout

```bash
POST /auth/logout
Authorization: Bearer <accessToken>
```

### Protecting Routes

#### Using @Roles Decorator

```typescript
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Post('create')
async create(@Body() dto: CreateDto) {
  // Only admins and super admins can access
}
```

#### Using @Permissions Decorator

```typescript
@Permissions(Permission.CREATE_STUDENT)
@Post('create')
async create(@Body() dto: CreateDto) {
  // Only users with CREATE_STUDENT permission can access
}
```

#### Using Both

```typescript
@Roles(Role.ADMIN)
@Permissions(Permission.UPDATE_STUDENT)
@Put('/:id')
async update(@Param('id') id: string, @Body() dto: UpdateDto) {
  // Must be an admin AND have UPDATE_STUDENT permission
}
```

#### Public Routes

```typescript
@Public()
@Get('public-data')
async getPublicData() {
  // Anyone can access this without authentication
}
```

#### Get Current User

```typescript
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  // user contains: { userId, email, role, permissions }
  return user;
}
```

## Available Permissions

### Student Permissions

- `CREATE_STUDENT`
- `READ_STUDENT`
- `UPDATE_STUDENT`
- `DELETE_STUDENT`

### Teacher Permissions

- `CREATE_TEACHER`
- `READ_TEACHER`
- `UPDATE_TEACHER`
- `DELETE_TEACHER`

### Course Permissions

- `CREATE_COURSE`
- `READ_COURSE`
- `UPDATE_COURSE`
- `DELETE_COURSE`

### Enrollment Permissions

- `CREATE_ENROLLMENT`
- `READ_ENROLLMENT`
- `UPDATE_ENROLLMENT`
- `DELETE_ENROLLMENT`

### Result Permissions

- `CREATE_RESULT`
- `READ_RESULT`
- `UPDATE_RESULT`
- `DELETE_RESULT`

### User & Role Permissions

- `CREATE_USER`
- `READ_USER`
- `UPDATE_USER`
- `DELETE_USER`
- `MANAGE_ROLES`
- `MANAGE_PERMISSIONS`

## Example: Student Controller with RBAC

```typescript
@ApiTags("Student")
@Controller("student")
export class StudentController {
  @Get()
  @Permissions(Permission.READ_STUDENT)
  async findAll(@Query() filter: StudentPaginationDto) {
    // Only users with READ_STUDENT permission
  }

  @Post("create")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE_STUDENT)
  async create(@Body() student: CreateStudentDto) {
    // Only ADMIN or SUPER_ADMIN with CREATE_STUDENT permission
  }

  @Delete("/:id")
  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.DELETE_STUDENT)
  async delete(@Param("id") id: string) {
    // Only SUPER_ADMIN with DELETE_STUDENT permission
  }
}
```

## Security Best Practices

1. **Store JWT secrets in environment variables** - Never commit secrets to version control
2. **Use HTTPS in production** - JWT tokens should only be transmitted over secure connections
3. **Set appropriate token expiration times** - Access tokens: 15 minutes, Refresh tokens: 7 days
4. **Hash refresh tokens** - Refresh tokens are hashed before storing in database
5. **Implement token rotation** - Refresh tokens are rotated on each use
6. **Validate user status** - Check if user is active before granting access

## Testing

All routes except those marked with `@Public()` now require authentication. Use the access token in the Authorization header:

```bash
curl -H "Authorization: Bearer <accessToken>" http://localhost:3000/student
```

## Next Steps

1. Create a database seeder for initial roles and permissions
2. Add more granular permissions as needed
3. Implement refresh token rotation
4. Add rate limiting for auth endpoints
5. Add password reset functionality
6. Add email verification
