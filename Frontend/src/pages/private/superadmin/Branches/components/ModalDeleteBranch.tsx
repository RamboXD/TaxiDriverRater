import { Button, Group, Modal, ModalProps, Text, Title } from '@mantine/core';
import useDeleteBranch from 'hooks/branch/useDeleteBranch';
import { Branch } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface ModalDeleteBranchProps
  extends Pick<ModalProps, 'opened' | 'onClose'> {
  branch?: Branch;
}

const ModalDeleteBranch = ({
  opened,
  onClose,
  branch,
}: ModalDeleteBranchProps) => {
  const deleteBranchMutation = useDeleteBranch();

  const handleDelete = () => {
    if (branch) {
      deleteBranchMutation.mutate(branch.id, {
        onSuccess: () => {
          showSuccessNotification('Branch delete success');
          onClose();
        },
        onError: (error) => {
          showErrorNotification(
            'Branch delete failed',
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
      title={<Title order={3}>Delete branch</Title>}
      centered
    >
      <Text>{`Are you sure that you want to delete "${branch?.name}"? The changes are not recoverable.`}</Text>
      <Group mt='md' position='right'>
        <Button
          variant='default'
          onClick={onClose}
          disabled={deleteBranchMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color='red'
          onClick={handleDelete}
          loading={deleteBranchMutation.isLoading}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalDeleteBranch;
