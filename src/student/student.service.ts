import { Injectable } from '@nestjs/common';
import { IDataService } from 'src/repositories/interfaces/dataservice.interface';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly dataService: IDataService) {}

  async findAllStudents(): Promise<Student[]> {
    return await this.dataService.students.find();
  }

  async createStudent(): Promise<{ message: string; student: Student }> {
    try {
      console.log('Creating new student with dummy data...');
      console.log('DataService:', this.dataService);
      console.log('Students repository:', this.dataService.students);
      console.log(
        'Repository methods available:',
        Object.getOwnPropertyNames(
          Object.getPrototypeOf(this.dataService.students),
        ),
      );

      const student = new Student();
      student.firstName = 'John';
      student.lastName = 'Doe';
      student.email = `john.doe.${Date.now()}@example.com`; // Make email unique
      student.dateOfBirth = new Date('1995-05-15');
      student.password = 'password123';
      student.gender = 'male';

      console.log('Student data before saving:', student);

      console.log('Attempting to save with .save() method...');
      const savedStudent = await this.dataService.students.save(student);
      console.log('Student saved with .save():', savedStudent);

      const allStudents = await this.dataService.students.find();
      console.log('Total students in database:', allStudents.length);
      console.log('All students:', allStudents);

      return {
        message: 'Student created successfully',
        student: savedStudent,
      };
    } catch (error) {
      console.error('Error creating student:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async createMultipleStudents(): Promise<{
    message: string;
    students: Student[];
  }> {
    try {
      console.log('Creating multiple students with dummy data...');

      const studentsData = [
        {
          firstName: 'Alice',
          lastName: 'Smith',
          email: `alice.smith.${Date.now()}@example.com`,
          dateOfBirth: new Date('1996-03-20'),
          password: 'alice123',
          gender: 'female' as const,
        },
        {
          firstName: 'Bob',
          lastName: 'Johnson',
          email: `bob.johnson.${Date.now() + 1}@example.com`,
          dateOfBirth: new Date('1994-08-10'),
          password: 'bob123',
          gender: 'male' as const,
        },
        {
          firstName: 'Charlie',
          lastName: 'Brown',
          email: `charlie.brown.${Date.now() + 2}@example.com`,
          dateOfBirth: new Date('1997-12-05'),
          password: 'charlie123',
          gender: 'male' as const,
        },
      ];

      const students: Student[] = [];

      for (const studentData of studentsData) {
        const student = new Student();
        Object.assign(student, studentData);
        const savedStudent = await this.dataService.students.save(student);
        students.push(savedStudent);
        console.log(
          'Created student:',
          savedStudent.firstName,
          savedStudent.lastName,
        );
      }

      const allStudents = await this.dataService.students.find();
      console.log(
        'Total students in database after bulk creation:',
        allStudents.length,
      );

      return {
        message: `Successfully created ${students.length} students`,
        students,
      };
    } catch (error) {
      console.error('Error creating multiple students:', error);
      throw error;
    }
  }

  async getStudentsCount(): Promise<{ count: number; students: Student[] }> {
    try {
      const students = await this.dataService.students.find();
      console.log('Retrieved students from database:', students.length);

      return {
        count: students.length,
        students,
      };
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }
}
