/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Branch } from './Branch';
import type { Staff } from './Staff';

export type Order = {
    id: string;
    readonly staff: Staff;
    readonly branch: Branch;
    readonly createdAt: string;
    readonly updatedAt: string;
    deliveryDate: string;
    /**
     * * `created` - Created
     * * `approved` - Approved
     * * `declined` - Declined
     * * `packaging` - Packaging
     * * `delivery` - Delivery
     * * `finished` - Finished
     * * `canceled` - Canceled
     */
    status: 'created' | 'approved' | 'declined' | 'packaging' | 'delivery' | 'finished' | 'canceled';
    totalPrice: number;
    transaction: string | null;
};

