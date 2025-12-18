import { Controller, Get } from '@nestjs/common';

import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll() {
    return await this.studentService.findAllStudents();
  }

  @Get('create')
  async create() {
    return await this.studentService.createStudent();
  }

  @Get('create-multiple')
  async createMultiple() {
    return await this.studentService.createMultipleStudents();
  }

  @Get('count')
  async getCount() {
    return await this.studentService.getStudentsCount();
  }

  @Get('test-database')
  async testDatabase() {
    try {
      // First, get current count
      const initialCount = await this.studentService.getStudentsCount();

      // Create a test student
      const createResult = await this.studentService.createStudent();

      // Get count after creation
      const finalCount = await this.studentService.getStudentsCount();

      return {
        message: 'Database test completed',
        initialCount: initialCount.count,
        finalCount: finalCount.count,
        studentCreated: createResult.student,
        databaseWorking: finalCount.count > initialCount.count,
      };
    } catch (error) {
      return {
        message: 'Database test failed',
        error: error.message,
        databaseWorking: false,
      };
    }
  }
}
