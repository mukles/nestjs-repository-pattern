export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDto {
  code: string;
  name: string;
  description: string;
  credits: number;
}

export interface UpdateCourseDto {
  name?: string;
  description?: string;
  credits?: number;
  status?: string;
}
