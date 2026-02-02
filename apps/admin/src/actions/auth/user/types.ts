import { Permission, Role } from "@repo/shared-types";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  roles?: Role[];
  permissions?: Permission[];
}
