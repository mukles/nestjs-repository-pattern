import { IDataService } from "repositories/interfaces/dataservice.interface";
import { ObjectLiteral } from "typeorm";

import { IGenericRepository } from "../../repositories/interfaces/repository.interface";

export const mockRepository = <T extends ObjectLiteral>(): Partial<
  IGenericRepository<T>
> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
  }),
});

export const mockDataService = {
  provide: IDataService,
  useValue: {
    students: mockRepository(),
    teachers: mockRepository(),
    parents: mockRepository(),
    parentAttachments: mockRepository(),
    studentAttachments: mockRepository(),
    courses: mockRepository(),
    enrollments: mockRepository(),
    users: mockRepository(),
    roles: mockRepository(),
    batches: mockRepository(),
    permissions: mockRepository(),
    results: mockRepository(),
    sessions: mockRepository(),
  } as jest.Mocked<IDataService>,
};
