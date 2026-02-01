interface Pagination {
  page: number;
  take: number;
}

export interface GetStudentsParams extends Pagination {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  email?: string;
  name?: string;
}

export interface StudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}
