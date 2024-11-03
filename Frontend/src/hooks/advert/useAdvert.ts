import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { UseQueryResult, useQuery } from 'react-query';
import { Advert } from 'types/generated';

export default function useAdvert({
  advertId,
}: {
  advertId?: string;
}): UseQueryResult<AxiosResponse<Advert[]>, AxiosError<{ message: string }>> {
  const client = useClient();

  const fetchAdvert = () => {
    return client.get(`adverts/${advertId}`);
  };

  return useQuery(['adverts', advertId], fetchAdvert, {
    enabled: !!advertId,
  });
}
