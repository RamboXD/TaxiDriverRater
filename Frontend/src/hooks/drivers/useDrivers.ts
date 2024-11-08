import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { GetDriversResponse } from 'types/profileTypes';

export default function useDrivers(): UseQueryResult<
  AxiosResponse<GetDriversResponse>,
  AxiosError
> {
  const client = useClient();

  const fetchDrivers = () => client.get('/auth/drivers');

  return useQuery('drivers', fetchDrivers, {
    refetchOnWindowFocus: false,
  });
}
