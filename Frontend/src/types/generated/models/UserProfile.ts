/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

// types/profileTypes.ts

// Define Company structure based on the response
export type CompanyProfile = {
  ID: string;
  IIN: string;
  BIN: string;
  Address: string;
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
