// Super Admin Profile
export interface SuperAdminProfile {
  userID: string;
  role: 'super_admin';
  email: string;
  name: string;
  surname: string;
  patronymic?: string; // Optional, depending on if patronymic is required
  createdAt: string;
  updatedAt: string;
}

// Company Admin Profile
export interface CompanyAdminProfile {
  userID: string;
  role: 'company_admin';
  email: string;
  name: string;
  surname: string;
  patronymic?: string;
  companyID: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

// Worker Profile
export interface WorkerProfile {
  userID: string;
  role: 'worker';
  email: string;
  name: string;
  surname: string;
  patronymic?: string;
  companyID: string;
  createdAt: string;
  updatedAt: string;
}

// Define Company structure based on the response
export type CompanyProfile = {
  ID: string;
  IIN: string;
  BIN: string;
  Address: string;
  Name: string;
  HeadName: string;
  HeadSurname: string;
  HeadPatronymic?: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};

// Define the User structure based on the response
export type User = {
  company_admin_id?: string;
  company_id: string;
  email?: string;
  iin: string;
  name: string;
  surname: string;
  patronymic?: string | null;
  created_at: string;
  updated_at: string;
};

// UserProfile type that encompasses user, company, and role
export type UserProfile = {
  user: User;
  company?: CompanyProfile;
  role: 'super_admin' | 'company_admin' | 'worker';
};

// types/profileTypes.ts

export enum UserRole {
  SuperAdmin = 'super_admin',
  CompanyAdmin = 'company_admin',
  Worker = 'worker',
}

export type GetCompanyCompanyProfile = {
  ID: string;
  IIN: string;
  BIN: string;
  Address: string;
  Name: string;
  HeadName: string;
  HeadSurname: string;
  HeadPatronymic: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};

export type GetCompanyUserProfile = {
  IIN: string;
  Name: string;
  Surname: string;
  Patronymic: string | null;
  Email: string;
  CreatedAt: string;
  UpdatedAt: string;
  Role: UserRole;
};

// Define a response structure if needed
export type CompanyWithUsersResponse = {
  company: GetCompanyCompanyProfile;
  users: GetCompanyUserProfile[];
};
