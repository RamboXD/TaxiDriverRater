import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { UserProfile } from 'types/profileTypes';
import {
  showSuccessNotification,
  showErrorNotification,
} from 'utils/notifications';

export type UserProfileUpdatePayload = {
  name: string;
  surname: string;
  patronymic?: string;
  iin: string;
};

export default function useUpdateUserProfile(
  userID: string,
): UseMutationResult<
  AxiosResponse<UserProfile>,
  AxiosError<{ message: string }>,
  UserProfileUpdatePayload
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const updateUserProfile = (payload: UserProfileUpdatePayload) => {
    return client.put(`/auth/users/${userID}`, payload); // Update URL with userID
  };

  return useMutation(updateUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile', userID]);
      showSuccessNotification('Данные пользователя успешно обновлены');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      showErrorNotification(
        'Ошибка при обновлении данных пользователя',
        error.response?.data.message || error.message,
      );
    },
  });
}
