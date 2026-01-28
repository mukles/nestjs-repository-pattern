import { Gender } from './enum/student.gender.enum';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let dataService: any;

  beforeEach(() => {
    dataService = {
      students: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
          andWhere: jest.fn().mockReturnThis(),
        }),
      },
      teachers: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
      courses: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
      enrollments: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
      users: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      },
    };
    const roleService = {
      findByName: jest.fn().mockResolvedValue({ id: 2, name: 'student' }),
    };
    service = new StudentService(dataService, roleService as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createStudent', () => {
    it('should create a new student', async () => {
      dataService.students.findOne.mockResolvedValue(null);
      dataService.users.findOne.mockResolvedValue(null);
      dataService.students.create.mockReturnValue({
        id: 1,
        email: 'test@test.com',
      });
      dataService.users.create.mockReturnValue({
        id: 1,
        email: 'test@test.com',
      });
      dataService.students.save.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      dataService.users.save.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        dateOfBirth: new Date(),
        gender: Gender.MALE,
        password: 'password123',
      };
      const result = await service.createStudent(dto);
      expect(result.email).toBe('test@test.com');
    });

    it('should throw ConflictException if email exists', async () => {
      dataService.students.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        dateOfBirth: new Date(),
        gender: Gender.MALE,
        password: 'password123',
      };
      await expect(service.createStudent(dto)).rejects.toThrow(
        'Student with email',
      );
    });
  });

  describe('updateStudent', () => {
    it('should update an existing student', async () => {
      dataService.students.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      dataService.students.save.mockResolvedValue({
        id: 1,
        email: 'new@test.com',
      });
      const dto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'new@test.com',
        dateOfBirth: new Date(),
        gender: Gender.FEMALE,
      };
      const result = await service.updateStudent('1', dto);
      expect(result.student.email).toBe('new@test.com');
    });

    it('should throw NotFoundException if student not found', async () => {
      dataService.students.findOne.mockResolvedValue(null);
      const dto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'new@test.com',
        dateOfBirth: new Date(),
        gender: Gender.FEMALE,
      };
      await expect(service.updateStudent('1', dto)).rejects.toThrow(
        'Student with id',
      );
    });
  });

  describe('deleteStudent', () => {
    it('should delete an existing student', async () => {
      dataService.students.findOne.mockResolvedValue({ id: 1 });
      dataService.students.remove.mockResolvedValue({});
      const result = await service.deleteStudent('1');
      expect(result.message).toBe('Student deleted successfully');
    });

    it('should throw NotFoundException if student not found', async () => {
      dataService.students.findOne.mockResolvedValue(null);
      await expect(service.deleteStudent('1')).rejects.toThrow(
        'Student with id',
      );
    });
  });
});
