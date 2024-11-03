import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { Order } from 'types/generated';

export default function useFarmerOrders(): UseQueryResult<
  AxiosResponse<{ results: Order[] }>,
  AxiosError<{ message: string }>
> {
  const client = useClient();

  const getFarmerOrders = () => {
    return client.get(`orders/`);
  };

  return useQuery(['orders'], getFarmerOrders, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
