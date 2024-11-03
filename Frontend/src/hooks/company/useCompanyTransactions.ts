import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { UrlParams } from 'types';
import { CompanyTransactions } from 'types/generated';

export default function useCompanyTransactions({
  completed,
}: {
  completed: boolean;
}): UseQueryResult<
  AxiosResponse<CompanyTransactions[]>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const fetchCompanyTransactions = () => {
    const params: UrlParams = {};

    params.completed = completed ? 'true' : 'false';

    return client.get(`companies/transactions/`, { params });
  };

  return useQuery(
    ['companyTransactions', completed],
    fetchCompanyTransactions,
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );
}
