import { DataSource } from "typeorm";

import { PermissionEntity } from "../../role/entities/permission.entity";
import { RoleEntity } from "../../role/entities/role.entity";
import { Permission } from "../../role/enums/permission.enum";
import { Role as RoleEnum } from "../../role/enums/role.enum";

// Define permissions for each role
const rolePermissions: Record<RoleEnum, Permission[]> = {
  [RoleEnum.SUPER_ADMIN]: Object.values(Permission), // All permissions

  [RoleEnum.ADMIN]: [
    // Student permissions
    Permission.CREATE_STUDENT,
    Permission.READ_STUDENT,
    Permission.UPDATE_STUDENT,
    Permission.DELETE_STUDENT,
    // Teacher permissions
    Permission.CREATE_TEACHER,
    Permission.READ_TEACHER,
    Permission.UPDATE_TEACHER,
    Permission.DELETE_TEACHER,
    // Course permissions
    Permission.CREATE_COURSE,
    Permission.READ_COURSE,
    Permission.UPDATE_COURSE,
    Permission.DELETE_COURSE,
    // Enrollment permissions
    Permission.CREATE_ENROLLMENT,
    Permission.READ_ENROLLMENT,
    Permission.UPDATE_ENROLLMENT,
    Permission.DELETE_ENROLLMENT,
    // Result permissions
    Permission.CREATE_RESULT,
    Permission.READ_RESULT,
    Permission.UPDATE_RESULT,
    Permission.DELETE_RESULT,
    // User permissions
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
  ],

  [RoleEnum.TEACHER]: [
    // Read students
    Permission.READ_STUDENT,
    // Read teachers
    Permission.READ_TEACHER,
    // Course permissions (limited)
    Permission.READ_COURSE,
    Permission.UPDATE_COURSE,
    // Enrollment permissions (read only)
    Permission.READ_ENROLLMENT,
    // Result permissions (full for their courses)
    Permission.CREATE_RESULT,
    Permission.READ_RESULT,
    Permission.UPDATE_RESULT,
  ],

  [RoleEnum.STUDENT]: [
    // Read own info
    Permission.READ_STUDENT,
    // Read teachers
    Permission.READ_TEACHER,
    // Read courses
    Permission.READ_COURSE,
    // Read own enrollments
    Permission.READ_ENROLLMENT,
    // Read own results
    Permission.READ_RESULT,
  ],
};

const roleDescriptions: Record<RoleEnum, string> = {
  [RoleEnum.SUPER_ADMIN]: "Super Administrator with full system access",
  [RoleEnum.ADMIN]: "Administrator with management capabilities",
  [RoleEnum.TEACHER]: "Teacher with course and result management",
  [RoleEnum.STUDENT]: "Student with limited read access",
};

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(RoleEntity);
  const permissionRepository = dataSource.getRepository(PermissionEntity);

  const allRoles = Object.values(RoleEnum);
  let createdCount = 0;
  let updatedCount = 0;

  for (const roleName of allRoles) {
    let role = await roleRepository.findOne({
      where: { name: roleName },
      relations: ["permissions"],
    });

    // Get permissions for this role
    const permissionNames = rolePermissions[roleName];
    const permissions = await permissionRepository.find({
      where: permissionNames.map((name) => ({ name })),
    });

    if (!role) {
      role = roleRepository.create({
        name: roleName,
        description: roleDescriptions[roleName],
        permissions,
      });
      await roleRepository.save(role);
      createdCount++;
    } else {
      // Update permissions if role exists
      role.permissions = permissions;
      role.description = roleDescriptions[roleName];
      await roleRepository.save(role);
      updatedCount++;
    }
  }

  console.log(
    `✅ Roles seeded: ${createdCount} created, ${updatedCount} updated`,
  );
}
