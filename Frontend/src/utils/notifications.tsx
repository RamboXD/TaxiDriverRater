import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export const showSuccessNotification = (
  successTitle: string,
  successMessage?: string,
): void => {
  notifications.show({
    title: successTitle,
    message: successMessage || '',
    color: 'green',
    autoClose: 5000,
    withCloseButton: true,
    icon: <IconCheck size='12px' />,
  });
};

export const showErrorNotification = (
  errorTitle: string,
  errorMessage?: string,
): void => {
  notifications.show({
    title: errorTitle,
    message: errorMessage || '',
    color: 'red',
    autoClose: 5000,
    withCloseButton: true,
    icon: <IconX size='12px' />,
  });
};
