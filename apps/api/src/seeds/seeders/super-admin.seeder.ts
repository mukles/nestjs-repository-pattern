import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { RoleEntity } from '../../role/entities/role.entity';
import { Role as RoleEnum } from '../../role/enums/role.enum';
import { UserEntity } from '../../user/entities/user.entity';

export async function seedSuperAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);
  // Get super admin role (should already be created by roles seeder)
  const superAdminRole = await roleRepository.findOne({
    where: { name: RoleEnum.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    console.log('❌ Super Admin role not found. Please run roles seeder first.');
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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('SuperAdmin@123', salt);

  await userRepository
    .createQueryBuilder()
    .insert()
    .into(UserEntity)
    .values({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      isActive: true,
      role: superAdminRole,
    })
    .execute();

  console.log('✅ Super Admin user created');
  console.log('   Email: superadmin@example.com');
  console.log('   Password: SuperAdmin@123');
}
