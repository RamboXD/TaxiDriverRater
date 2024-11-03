/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrossMarket } from './GrossMarket';
import type { Product } from './Product';
import type { Quality } from './Quality';
import type { Sort } from './Sort';

export type Advert = {
    id: string;
    grossMarket: GrossMarket;
    product: Product;
    sort: Sort;
    qualitiesOfAdvert: Array<Quality>;
    readonly createdAt: string;
    readonly updatedAt: string;
};

