import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { Order, OrderCreate } from 'types/generated';

export default function useCreateOrder(): UseMutationResult<
  AxiosResponse<Order>,
  AxiosError<{ message: string }>,
  OrderCreate
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createOrder = (payload: OrderCreate) => client.post('order/', payload);

  return useMutation(createOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
}
