/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SuperAdminProfile = {
  userID: string;
  role: 'super_admin';
  email: string;
  fullName: string; // Assume fullName is a combination of Name and Surname
  createdAt: string;
  updatedAt: string;
};

export type CompanyAdminProfile = {
  userID: string;
  role: 'company_admin';
  email: string;
  fullName: string;
  companyID: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkerProfile = {
  userID: string;
  role: 'worker';
  email: string;
  fullName: string;
  companyID: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyProfile = {
  companyID: string;
  companyName: string;
  iin: string;
  bin: string;
  address: string;
  headName: string;
  headSurname: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile =
  | SuperAdminProfile
  | CompanyAdminProfile
  | WorkerProfile;
