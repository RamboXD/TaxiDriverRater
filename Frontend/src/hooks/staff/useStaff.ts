import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useQuery, UseQueryResult } from 'react-query';
import { Staff } from 'types/generated';

export default function useStaff({
  staffId,
}: {
  staffId?: string;
}): UseQueryResult<AxiosResponse<Staff>, AxiosError<{ message: string }>> {
  const client = useClient();

  const fetchStaff = () => {
    return client.get(`staffs/${staffId}/`);
  };

  return useQuery(['staffs', staffId], fetchStaff, {
    enabled: !!staffId,
  });
}
