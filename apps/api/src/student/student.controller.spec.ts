import { Test, TestingModule } from '@nestjs/testing';

import { Gender } from './enum/student.gender.enum';
import { StudentStatus } from './enum/student.status.enum';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

describe('StudentController', () => {
  let controller: StudentController;

  const mockStudentService = {
    findPaginatedStudents: jest.fn().mockImplementation(() => Promise.resolve({})),
    createStudent: jest.fn().mockImplementation(() => Promise.resolve({})),
    updateStudent: jest.fn().mockImplementation(() => Promise.resolve({})),
    deleteStudent: jest.fn().mockImplementation(() => Promise.resolve({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated students', async () => {
      const filter = { page: 1, take: 10, skip: 0 };
      const result = {
        data: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            dateOfBirth: new Date(),
            gender: Gender.MALE,
            status: StudentStatus.ACTIVE,
          },
        ],
        meta: {
          page: 1,
          take: 10,
          itemCount: 1,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
      mockStudentService.findPaginatedStudents.mockResolvedValue(result);

      expect(await controller.findAll(filter)).toBe(result);
      expect(mockStudentService.findPaginatedStudents).toHaveBeenCalledWith(filter);
    });

    it('should filter by name', async () => {
      const filter = { page: 1, take: 10, skip: 0, name: 'John' };
      const result = {
        data: [],
        meta: {
          page: 1,
          take: 10,
          itemCount: 0,
          pageCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
      mockStudentService.findPaginatedStudents.mockResolvedValue(result);

      expect(await controller.findAll(filter)).toBe(result);
      expect(mockStudentService.findPaginatedStudents).toHaveBeenCalledWith(filter);
    });

    it('should filter by email', async () => {
      const filter = { page: 1, take: 10, skip: 0, email: 'john@test.com' };
      const result = {
        data: [],
        meta: {
          page: 1,
          take: 10,
          itemCount: 0,
          pageCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
      mockStudentService.findPaginatedStudents.mockResolvedValue(result);

      expect(await controller.findAll(filter)).toBe(result);
      expect(mockStudentService.findPaginatedStudents).toHaveBeenCalledWith(filter);
    });
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        dateOfBirth: new Date('2000-01-01'),
        gender: Gender.MALE,
        password: 'password123',
      };
      const result = {
        message: 'Student created successfully',
        student: { id: 1, ...dto, status: StudentStatus.ACTIVE },
      };
      mockStudentService.createStudent.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(mockStudentService.createStudent).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an existing student', async () => {
      const id = '1';
      const dto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
        dateOfBirth: new Date('2000-01-01'),
        gender: Gender.FEMALE,
        password: 'password123',
      };
      const result = {
        message: 'Student updated successfully',
        student: { id: 1, ...dto, status: StudentStatus.ACTIVE },
      };
      mockStudentService.updateStudent.mockResolvedValue(result);

      expect(await controller.update(id, dto)).toBe(result);
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('delete', () => {
    it('should delete a student', async () => {
      const id = '1';
      const result = { message: 'Student deleted successfully' };
      mockStudentService.deleteStudent.mockResolvedValue(result);

      expect(await controller.delete(id)).toBe(result);
      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(id);
    });
  });
});
