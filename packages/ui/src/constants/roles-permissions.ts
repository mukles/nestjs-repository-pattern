export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum Permission {
  // Hero Section
  CREATE_HERO_SECTION = 'create_hero_section',
  EDIT_HERO_SECTION = 'edit_hero_section',
  DELETE_HERO_SECTION = 'delete_hero_section',
  VIEW_HERO_SECTION = 'view_hero_section',

  // Student Permissions
  CREATE_STUDENT = 'create_student',
  READ_STUDENT = 'read_student',
  UPDATE_STUDENT = 'update_student',
  DELETE_STUDENT = 'delete_student',

  // Teacher Permissions
  CREATE_TEACHER = 'create_teacher',
  READ_TEACHER = 'read_teacher',
  UPDATE_TEACHER = 'update_teacher',
  DELETE_TEACHER = 'delete_teacher',

  // Course Permissions
  CREATE_COURSE = 'create_course',
  READ_COURSE = 'read_course',
  UPDATE_COURSE = 'update_course',
  DELETE_COURSE = 'delete_course',
}
