import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Order } from 'types/generated';

interface OrderStatusUpdate {
  status?: Order['status'];
  orderId: string;
  newStatus?:
    | 'created'
    | 'approved'
    | 'declined'
    | 'packaging'
    | 'delivery'
    | 'finished'
    | 'canceled';
}
export default function useUpdateTransaction(): UseMutationResult<
  AxiosResponse<unknown>,
  AxiosError<{ details: string }>,
  OrderStatusUpdate
> {
  const queryClient = useQueryClient();
  const client = useClient();

  const updateCompany = (payload: OrderStatusUpdate) => {
    return client.patch(`order/${payload.orderId}`, payload);
  };

  return useMutation(updateCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
}
