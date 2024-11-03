/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';

export type BranchInvoiceItem = {
    name: string;
    email: string | null;
    phone: string;
    address: Address;
    readonly paymentAmount: string;
};

