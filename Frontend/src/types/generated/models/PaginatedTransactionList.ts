/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Transaction } from './Transaction';

export type PaginatedTransactionList = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<Transaction>;
};

