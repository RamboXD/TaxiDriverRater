import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { DriverWithRatingsResponse } from 'types/profileTypes';
import { useClient } from 'contexts/AuthContext';

export default function useDriverWithRatings(
  driverId: string | undefined,
): UseQueryResult<AxiosResponse<DriverWithRatingsResponse>, AxiosError> {
  const client = useClient();

  const fetchDriverWithRatings = () => client.get(`/auth/driver/${driverId}`);

  return useQuery(['driverWithRatings', driverId], fetchDriverWithRatings, {
    enabled: !!driverId,
    refetchOnWindowFocus: false,
  });
}
