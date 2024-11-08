import { Button, Group, Modal, ModalProps, Text, Title } from '@mantine/core';
import useDeleteFarm from 'hooks/farm/useDeleteFarm';
import { GrossMarket } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface ModalDeleteFarmProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  farm?: GrossMarket;
}

const ModalDeleteFarm = ({ opened, onClose, farm }: ModalDeleteFarmProps) => {
  const deleteFarmMutation = useDeleteFarm();

  const handleDelete = () => {
    if (farm) {
      deleteFarmMutation.mutate(farm.id!, {
        onSuccess: () => {
          showSuccessNotification('Farm delete success');
          onClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Farm delete failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Delete farm</Title>}
      centered
    >
      <Text>{`Are you sure that you want to delete "${farm?.name}"? The changes are not recoverable.`}</Text>
      <Group mt='md' position='right'>
        <Button
          variant='default'
          onClick={onClose}
          disabled={deleteFarmMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color='red'
          onClick={handleDelete}
          loading={deleteFarmMutation.isLoading}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalDeleteFarm;
