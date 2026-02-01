export interface Permission {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto extends Omit<
  User,
  "id" | "role" | "isActive" | "createdAt" | "updatedAt"
> {
  password?: string;
  roleId: number;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  isActive?: boolean;
}
