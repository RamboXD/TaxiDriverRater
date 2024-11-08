import { Button, Group, Modal, ModalProps, Text, Title } from '@mantine/core';
import useDeleteAdvert from 'hooks/advert/useDeleteAdvert';
import { Advert } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface ModalDeleteFarmProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  advert?: Advert;
}

const ModalDeleteProduct = ({
  opened,
  onClose,
  advert,
}: ModalDeleteFarmProps) => {
  const deleteAdvertMutation = useDeleteAdvert();

  const handleDelete = () => {
    if (advert) {
      deleteAdvertMutation.mutate(advert.id!, {
        onSuccess: () => {
          showSuccessNotification('Advert delete success');
          onClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Advert delete failed',
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
      <Text>{`Are you sure that you want to delete "${advert?.product.name}"? The changes are not recoverable.`}</Text>
      <Group mt='md' position='right'>
        <Button
          variant='default'
          onClick={onClose}
          disabled={deleteAdvertMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color='red'
          onClick={handleDelete}
          loading={deleteAdvertMutation.isLoading}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalDeleteProduct;
