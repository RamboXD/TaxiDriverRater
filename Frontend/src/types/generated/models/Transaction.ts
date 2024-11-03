/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Transaction = {
    readonly id: string;
    readonly createdAt: string;
    /**
     * * `pending` - Pending
     * * `payment` - Payment
     * * `confirm` - Confirm
     * * `completed` - Completed
     */
    status: 'pending' | 'payment' | 'confirm' | 'completed';
    readonly totalPaymentAmount: string;
    paymentDate: string | null;
    nonCashCoef: number;
};

