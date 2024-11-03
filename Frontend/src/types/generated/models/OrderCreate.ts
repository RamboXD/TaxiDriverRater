/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderItemCreate } from './OrderItemCreate';

export type OrderCreate = {
    branch: string;
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
    orderItems: Array<OrderItemCreate>;
};

