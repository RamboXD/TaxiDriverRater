import { Button, Group, Modal, ModalProps, Text, Title } from '@mantine/core';
import useDeleteStaff from 'hooks/staff/useDeleteStaff';
import { Staff } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface ModalDeleteFarmProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  staff?: Staff;
}

const ModalDeleteStaff = ({ opened, onClose, staff }: ModalDeleteFarmProps) => {
  const deleteStaffMutation = useDeleteStaff();

  const handleDelete = () => {
    if (staff) {
      deleteStaffMutation.mutate(staff.id, {
        onSuccess: () => {
          showSuccessNotification('Staff delete success');
          onClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Staff delete failed',
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
      title={<Title order={3}>Delete staff</Title>}
      centered
    >
      <Text>{`Are you sure that you want to delete "${staff?.firstName}"? The changes are not recoverable.`}</Text>
      <Group mt='md' position='right'>
        <Button
          variant='default'
          onClick={onClose}
          disabled={deleteStaffMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color='red'
          onClick={handleDelete}
          loading={deleteStaffMutation.isLoading}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalDeleteStaff;
