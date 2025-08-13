export interface User {
  id: number;
  username: string;
  realName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  email?: string;
  phone?: string;
  studentId?: string;
  isActive?: boolean;
}

export interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  credit: number;
  description?: string;
  teacherName?: string;
}

export interface Grade {
  id: number;
  studentName: string;
  courseName: string;
  score: number;
  semester: string;
  academicYear: string;
  teacherName: string;
  student?: Student;
  course?: Course;
}

export interface Student {
  id: number;
  userName?: string;
  realName?: string;
  studentNumber: string;
  className: string;
  major: string;
  enrollmentYear: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  nationality?: string;
  politicalStatus?: string;
  idCardNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  realName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  userId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface GradeStatistics {
  average: number;
  highest: number;
  lowest: number;
  count: number;
  passedCount: number;
  passRate: number;
}

export interface CourseGrade extends Grade {
  courseName: string;
  courseCode: string;
  credit: number;
  gpa?: number;
}

export interface UserWithGrades extends User {
  grades?: CourseGrade[];
  statistics?: GradeStatistics;
}