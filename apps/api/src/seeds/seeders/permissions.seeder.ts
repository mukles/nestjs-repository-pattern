import { DataSource } from 'typeorm';

import { PermissionEntity } from '../../role/entities/permission.entity';
import { Permission } from '../../role/enums/permission.enum';

// Permission descriptions mapping
const permissionDescriptions: Record<Permission, string> = {
  // Student permissions
  [Permission.CREATE_STUDENT]: 'Create new students',
  [Permission.READ_STUDENT]: 'View student information',
  [Permission.UPDATE_STUDENT]: 'Update student information',
  [Permission.DELETE_STUDENT]: 'Delete students',

  // Teacher permissions
  [Permission.CREATE_TEACHER]: 'Create new teachers',
  [Permission.READ_TEACHER]: 'View teacher information',
  [Permission.UPDATE_TEACHER]: 'Update teacher information',
  [Permission.DELETE_TEACHER]: 'Delete teachers',

  // Course permissions
  [Permission.CREATE_COURSE]: 'Create new courses',
  [Permission.READ_COURSE]: 'View course information',
  [Permission.UPDATE_COURSE]: 'Update course information',
  [Permission.DELETE_COURSE]: 'Delete courses',

  // Enrollment permissions
  [Permission.CREATE_ENROLLMENT]: 'Create new enrollments',
  [Permission.READ_ENROLLMENT]: 'View enrollment information',
  [Permission.UPDATE_ENROLLMENT]: 'Update enrollment information',
  [Permission.DELETE_ENROLLMENT]: 'Delete enrollments',

  // Result permissions
  [Permission.CREATE_RESULT]: 'Create new results',
  [Permission.READ_RESULT]: 'View result information',
  [Permission.UPDATE_RESULT]: 'Update result information',
  [Permission.DELETE_RESULT]: 'Delete results',

  // User permissions
  [Permission.CREATE_USER]: 'Create new users',
  [Permission.READ_USER]: 'View user information',
  [Permission.UPDATE_USER]: 'Update user information',
  [Permission.DELETE_USER]: 'Delete users',

  // Role permissions
  [Permission.MANAGE_ROLES]: 'Manage roles',
  [Permission.MANAGE_PERMISSIONS]: 'Manage permissions',
};

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(PermissionEntity);

  const allPermissions = Object.values(Permission);
  let createdCount = 0;
  let existingCount = 0;

  for (const permission of allPermissions) {
    const existingPermission = await permissionRepository.findOne({
      where: { name: permission },
    });

    if (!existingPermission) {
      const newPermission = permissionRepository.create({
        name: permission,
        description: permissionDescriptions[permission],
      });
      await permissionRepository.save(newPermission);
      createdCount++;
    } else {
      existingCount++;
    }
  }

  console.log(
    `✅ Permissions seeded: ${createdCount} created, ${existingCount} already existed`,
  );
}
