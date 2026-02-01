import { Role } from "../constants/roles.js";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roles: Role[];
}
