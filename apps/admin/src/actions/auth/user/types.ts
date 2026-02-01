import { Role } from '@/lib/constants/roles';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  roles: Role[];
}
