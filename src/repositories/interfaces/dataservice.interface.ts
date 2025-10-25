import { Student } from 'src/student/entities/student.entity';
import { IGenericRepository } from './repository.interface';

export abstract class IDataService {
  students: IGenericRepository<Student>;
  // And the other repositories, for example: authors, books
}
