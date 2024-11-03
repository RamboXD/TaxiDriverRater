import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { UrlParams } from 'types';
import { Order, PaginatedOrderList } from 'types/generated';

export default function useOrders({
  transactionId,
  branchId,
  search,
  statuses,
}: {
  transactionId: string;
  branchId: string;
  search?: string;
  statuses?: Order['status'][];
}): UseQueryResult<
  AxiosResponse<PaginatedOrderList>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchOrders = () => {
    const params: UrlParams = {};

    if (statuses?.length) {
      params.statuses = statuses.join(',');
    }
    if (search) {
      params.search = search;
    }
    if (transactionId) {
      params.transaction_id = transactionId;
    }
    if (branchId) {
      params.branch_id = branchId;
    }

    return client.get(`orders/`, { params });
  };

  return useQuery(
    ['orders', search, statuses, transactionId, branchId],
    fetchOrders,
  );
}
