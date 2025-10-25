import { Injectable, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'src/constants';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { StudentTypeOrmRepository } from './implementation/student.repository.implementation';
import { STUDENT_REPOSITORY_TOKEN } from './student.repository.interface';

export function provideStudentRepository(): Provider[] {
  return [
    {
      provide: STUDENT_REPOSITORY_TOKEN,
      useFactory: (dependenciesProvider: StudentRepoDependenciesProvider) =>
        provideStudentRepositoryFactory(dependenciesProvider),
      inject: [StudentRepoDependenciesProvider],
    },
    StudentRepoDependenciesProvider,
  ];
}

function provideStudentRepositoryFactory(
  dependenciesProvider: StudentRepoDependenciesProvider,
) {
  const dataSourceEnv = process.env.STUDENT_DATASOURCE;
  const dataSource = dataSourceEnv as DataSource;

  switch (dataSource) {
    case DataSource.TYPEORM:
      return new StudentTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
      );
  }
}

@Injectable()
export class StudentRepoDependenciesProvider {
  constructor(
    @InjectRepository(Student)
    public typeOrmRepository: Repository<Student>,
  ) {}
}
