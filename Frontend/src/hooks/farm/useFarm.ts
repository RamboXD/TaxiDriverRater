import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { GrossMarket } from 'types/generated';

export default function useFarm(
  farmId?: string,
): UseQueryResult<AxiosResponse<GrossMarket>, AxiosError<{ message: string }>> {
  const client = useClient();

  const getFarm = () => client.get(`farms/${farmId}`);

  return useQuery(['farms', farmId], getFarm, {
    enabled: !!farmId,
  });
}
