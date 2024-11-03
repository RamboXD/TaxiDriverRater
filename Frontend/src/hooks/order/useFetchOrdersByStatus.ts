import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { Order } from 'types/generated';

export default function useFetchOrdersByStatus(
  status: string,
): UseQueryResult<AxiosResponse<{ results: Order[] }>, AxiosError> {
  const client = useClient();

  const fetchOrdersByStatus = () => {
    return client.get(`orders/?statuses=${status}`);
  };

  return useQuery(['orders', status], fetchOrdersByStatus, {
    enabled: !!status, // Only run query if status is provided
  });
}
