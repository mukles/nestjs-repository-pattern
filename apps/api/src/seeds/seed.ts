import { SeedDataSource } from "./seed.config";
import { seedPermissions, seedRoles, seedSuperAdmin } from "./seeders";

async function runSeeds(): Promise<void> {
  try {
    await SeedDataSource.initialize();
    console.log("🔌 Database connection established\n");

    // Run all seeders in order
    console.log("🌱 Running seeders...\n");

    // 1. Seed Permissions first (roles depend on permissions)
    console.log("--- Permissions Seeder ---");
    await seedPermissions(SeedDataSource);
    console.log("");

    // 2. Seed Roles (with permissions)
    console.log("--- Roles Seeder ---");
    await seedRoles(SeedDataSource);
    console.log("");

    // 3. Seed Super Admin user
    console.log("--- Super Admin Seeder ---");
    await seedSuperAdmin(SeedDataSource);
    console.log("");

    // Add more seeders here as needed:
    // console.log('--- Courses Seeder ---');
    // await seedCourses(SeedDataSource);
    // console.log('');

    console.log("✅ All seeds completed successfully!");

    await SeedDataSource.destroy();
  } catch (error) {
    console.error("❌ Error running seeds:", error);
    process.exit(1);
  }
}

void runSeeds();
