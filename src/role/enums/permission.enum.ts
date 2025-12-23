export enum Permission {
  // Student permissions
  CREATE_STUDENT = 'create:student',
  READ_STUDENT = 'read:student',
  UPDATE_STUDENT = 'update:student',
  DELETE_STUDENT = 'delete:student',

  // Teacher permissions
  CREATE_TEACHER = 'create:teacher',
  READ_TEACHER = 'read:teacher',
  UPDATE_TEACHER = 'update:teacher',
  DELETE_TEACHER = 'delete:teacher',

  // Course permissions
  CREATE_COURSE = 'create:course',
  READ_COURSE = 'read:course',
  UPDATE_COURSE = 'update:course',
  DELETE_COURSE = 'delete:course',

  // Enrollment permissions
  CREATE_ENROLLMENT = 'create:enrollment',
  READ_ENROLLMENT = 'read:enrollment',
  UPDATE_ENROLLMENT = 'update:enrollment',
  DELETE_ENROLLMENT = 'delete:enrollment',

  // Result permissions
  CREATE_RESULT = 'create:result',
  READ_RESULT = 'read:result',
  UPDATE_RESULT = 'update:result',
  DELETE_RESULT = 'delete:result',

  // User permissions
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  // Role permissions
  MANAGE_ROLES = 'manage:roles',
  MANAGE_PERMISSIONS = 'manage:permissions',
}
