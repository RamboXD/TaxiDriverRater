import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { OrderItem } from 'types/generated';

export default function useOrderItemsFarmer(
  orderId: string | undefined,
): UseQueryResult<
  AxiosResponse<{ results: OrderItem[] }>,
  AxiosError<{ error: string }>
> {
  const client = useClient();

  const getOrderItemFarmer = () => {
    return client.get(`order_items/?order_id=${orderId}`);
  };

  return useQuery(['orderItemsFarmer', orderId], getOrderItemFarmer, {
    enabled: !!orderId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
