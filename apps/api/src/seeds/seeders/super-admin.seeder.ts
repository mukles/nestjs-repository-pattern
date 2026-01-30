import { DataSource } from 'typeorm';

import { RoleEntity } from '../../role/entities/role.entity';
import { Role as RoleEnum } from '../../role/enums/role.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { UserStatus } from '../../user/enums/user-status.enum';

export async function seedSuperAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);
  // Get super admin role (should already be created by roles seeder)
  const superAdminRole = await roleRepository.findOne({
    where: { name: RoleEnum.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    console.log(
      '❌ Super Admin role not found. Please run roles seeder first.',
    );
    return;
  }

  // Check if super admin user already exists
  const existingSuperAdmin = await userRepository.findOne({
    where: { email: 'superadmin@example.com' },
  });

  if (existingSuperAdmin) {
    console.log('ℹ️  Super Admin user already exists');
    return;
  }

  // Create super admin user
  // Note: Password will be automatically hashed by UserEntity's @BeforeInsert() hook
  const superAdmin = userRepository.create({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@example.com',
    password: 'SuperAdmin@123',
    status: UserStatus.ACTIVE,
    role: superAdminRole,
  });

  console.log('Creating Super Admin user with email:', superAdmin.email);

  await userRepository.save(superAdmin);

  console.log('✅ Super Admin user created');
  console.log('   Email: superadmin@example.com');
  console.log('   Password: SuperAdmin@123');
}
