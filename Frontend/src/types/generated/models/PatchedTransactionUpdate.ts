/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PatchedTransactionUpdate = {
    /**
     * * `pending` - Pending
     * * `payment` - Payment
     * * `confirm` - Confirm
     * * `completed` - Completed
     */
    status: 'pending' | 'payment' | 'confirm' | 'completed';
    nonCashCoef: number;
};

