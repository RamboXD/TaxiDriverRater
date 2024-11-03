/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillTo } from './BillTo';
import type { BranchInvoiceItem } from './BranchInvoiceItem';
import type { GrossMarket } from './GrossMarket';

export type CompanyInvoice = {
    grossMarket: GrossMarket;
    billTo: BillTo;
    details: string;
    invoiceItems: Array<BranchInvoiceItem>;
    payment: {
        amount: number,
        dueDate: string
    }
};

