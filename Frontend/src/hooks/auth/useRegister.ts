import { AxiosError, AxiosResponse } from 'axios';
import { UseMutationResult, useMutation } from 'react-query';
import { UserRegistration } from 'types/generated';
import { axiosUnauthorizedInstance } from 'utils/request';

export default function useRegister(): UseMutationResult<
  AxiosResponse<any>,
  AxiosError<{ message: string }>,
  UserRegistration
> {
  const register = (payload: UserRegistration) => {
    return axiosUnauthorizedInstance.post('auth/register', payload);
  };
  return useMutation(register);
}
