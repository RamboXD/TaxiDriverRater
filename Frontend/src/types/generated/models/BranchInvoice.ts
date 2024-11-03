/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillTo } from './BillTo';
import type { GrossMarket } from './GrossMarket';
import type { OrderInvoiceItem } from './OrderInvoiceItem';

export type BranchInvoice = {
  grossMarket: GrossMarket;
  billTo: BillTo;
  details: string;
  payment: {
    amount: number;
    dueDate: string;
  };
  invoiceItems: Array<OrderInvoiceItem>;
};
