/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserRegistration = {
    email: string;
    password: string;
    /**
     * * `owner` - owner
     * * `gm_owner` - gm_owner
     * * `staff` - staff
     */
    role: 'owner' | 'gm_owner' | 'staff';
};

