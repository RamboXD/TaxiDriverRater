import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { UrlParams } from 'types';
import { TransactionBranches } from 'types/generated';

export default function useTransactionBranches({
  transactionId,
}: {
  transactionId: string;
}): UseQueryResult<
  AxiosResponse<TransactionBranches[]>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getBranches = () => {
    const params: UrlParams = {};

    if (transactionId) {
      params.transaction_id = transactionId;
    }

    return client.get(`branches/transactions/`, { params });
  };

  return useQuery(['branchesTrs', transactionId], getBranches, {
    retry: false,
    getNextPageParam: (page) => {
      return page.data.next ? page.data.next : undefined;
    },
    getPreviousPageParam: (page) => {
      return page.data.previous ? page.data.previous : undefined;
    },
  });
}
