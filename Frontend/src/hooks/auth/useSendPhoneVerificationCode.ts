import { AxiosError, AxiosResponse } from 'axios';
import { UseMutationResult, useMutation } from 'react-query';
import { axiosUnauthorizedInstance } from 'utils/request';

export default function useSendPhoneVerificationCode(): UseMutationResult<
  AxiosResponse<void>,
  AxiosError<{ message: string }>,
  any
> {
  const sendPhoneVerifyCode = (payload: any) => {
    return axiosUnauthorizedInstance.post(
      'auth/send-phone-verification-code',
      payload,
    );
  };

  return useMutation(sendPhoneVerifyCode);
}
