import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770040592242 implements MigrationInterface {
    name = 'Migration1770040592242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('super_admin', 'admin', 'teacher', 'student')`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "name" "public"."roles_name_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

}
