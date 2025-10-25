import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { GenericDataService } from './implementation/dataservice.implementation';
import { IDataService } from './interfaces/dataservice.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher]),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [Student, Teacher],
          synchronize: false,
          logging: true,
          migrations: ['src/database/migrations/*.ts'],
          migrationsRun: true,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: GenericDataService,
    },
  ],
  exports: [IDataService],
})
export class PostgresDataServiceModule {}
