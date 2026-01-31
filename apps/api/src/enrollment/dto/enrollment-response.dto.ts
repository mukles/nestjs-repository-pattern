import { ApiProperty } from "@nestjs/swagger";

import { EnrollmentStatus } from "../enum/enrollment-status.enum";

class StudentInfo {
  @ApiProperty({ description: "Student ID" })
  id: number;

  @ApiProperty({ description: "Student name" })
  name: string;

  @ApiProperty({ description: "Student email" })
  email: string;
}

class CourseInfo {
  @ApiProperty({ description: "Course ID" })
  id: number;

  @ApiProperty({ description: "Course title" })
  title: string;

  @ApiProperty({ description: "Teacher name" })
  teacherName: string;
}

class BatchInfo {
  @ApiProperty({ description: "Batch ID" })
  id: number;

  @ApiProperty({ description: "Batch name" })
  name: string;
}

export class EnrollResponseDto {
  @ApiProperty({ description: "Enrollment ID" })
  id: number;

  @ApiProperty({ description: "Student information", type: () => StudentInfo })
  student: StudentInfo;

  @ApiProperty({ description: "Course information", type: () => CourseInfo })
  course: CourseInfo;

  @ApiProperty({ type: BatchInfo })
  batch: BatchInfo;

  @ApiProperty({
    description: "Status of the enrollment",
    enum: EnrollmentStatus,
  })
  status: EnrollmentStatus;

  @ApiProperty({
    description: "Reason for suspension",
    required: false,
    nullable: true,
  })
  suspensionReason?: string | null;

  @ApiProperty({
    description: "Date when enrollment was suspended",
    type: String,
    format: "date-time",
    required: false,
    nullable: true,
  })
  suspendedAt?: Date | null;

  @ApiProperty({
    description: "Date when enrollment was created",
    type: String,
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date when enrollment was last updated",
    type: String,
    format: "date-time",
  })
  updatedAt: Date;
}
