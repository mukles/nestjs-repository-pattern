import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PageMetaDto } from '../common/pagination/page-meta';
import { PaginationResultDto } from '../common/pagination/pagination-result.dto';
import { IDataService } from '../repositories/interfaces/dataservice.interface';
import { Role as RoleEnum } from '../role/enums/role.enum';
import { RoleService } from '../role/role.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentPaginationDto } from './dto/student-pagination.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    private readonly dataService: IDataService,
    private readonly roleService: RoleService,
  ) {}

  async findPaginatedStudents(
    filter: StudentPaginationDto,
  ): Promise<PaginationResultDto<StudentResponseDto>> {
    const qb = this.dataService.students.createQueryBuilder('student');

    if (filter.name) {
      qb.andWhere(
        "(student.firstName ILIKE :name OR student.lastName ILIKE :name OR CONCAT(student.firstName, ' ', student.lastName) ILIKE :name)",
        { name: `%${filter.name}%` },
      );
    }

    if (filter.email) {
      qb.andWhere('student.email ILIKE :email', { email: `%${filter.email}%` });
    }

    const [students, itemCount] = await qb
      .orderBy('student.createdAt', filter.order)
      .skip(filter.skip)
      .take(filter.take)
      .getManyAndCount();

    const pageMeta = new PageMetaDto({ pageOptionsDto: filter, itemCount });

    return new PaginationResultDto<StudentResponseDto>(students, pageMeta);
  }

  async createStudent(student: CreateStudentDto): Promise<StudentResponseDto> {
    const existingStudent = await this.dataService.students.findOne({
      where: { email: student.email },
    });

    if (existingStudent) {
      throw new ConflictException(`Student with email '${student.email}' already exists`);
    }

    const existingUser = await this.dataService.users.findOne({
      where: { email: student.email },
    });

    if (existingUser) {
      throw new ConflictException(`User with email '${student.email}' already exists`);
    }

    const studentRole = await this.roleService.findByName(RoleEnum.STUDENT);
    if (!studentRole) {
      throw new NotFoundException('Student role not found');
    }

    const { password, ...studentData } = student;
    const newStudent = this.dataService.students.create(studentData);
    await this.dataService.students.save(newStudent);

    const newUser = this.dataService.users.create({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      password: password,
      role: studentRole,
    });

    await this.dataService.users.save(newUser);

    return newStudent;
  }

  async getSingleStudent(id: string): Promise<StudentEntity> {
    const student = await this.dataService.students.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!student) {
      throw new NotFoundException(`Student with id '${id}' does not exist`);
    }

    return student;
  }

  async updateStudent(
    id: string,
    student: CreateStudentDto,
  ): Promise<{ message: string; student: StudentEntity }> {
    const existingStudent = await this.dataService.students.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!existingStudent) {
      throw new NotFoundException(`Student with id '${id}' does not exist`);
    }

    const updatedStudent = Object.assign(existingStudent, student);

    await this.dataService.students.save(updatedStudent);
    return { message: 'Student updated successfully', student: updatedStudent };
  }

  async deleteStudent(id: string): Promise<{ message: string }> {
    const existingStudent = await this.dataService.students.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!existingStudent) {
      throw new NotFoundException(`Student with id '${id}' does not exist`);
    }

    await this.dataService.students.remove(existingStudent);
    return { message: 'Student deleted successfully' };
  }
}
