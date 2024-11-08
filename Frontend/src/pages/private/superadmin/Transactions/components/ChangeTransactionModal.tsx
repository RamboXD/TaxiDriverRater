import {
  Button,
  Group,
  Modal,
  ModalProps,
  Stack,
  Stepper,
  Title
} from '@mantine/core';
import useUpdateTransaction from 'hooks/transactions/useUpdateTransaction';
import { Transaction } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface ChangeTransactionModalProps
  extends Pick<ModalProps, 'opened' | 'onClose'> {
  transaction: Transaction | null;
}

const ChangeTransactionModal = ({
  opened,
  onClose,
  transaction,
}: ChangeTransactionModalProps) => {
  const updateTransaction = useUpdateTransaction(transaction?.id);

  const getCurrentStage = (curr_status: string): number => {
    if (curr_status == 'pending') return 1;
    if (curr_status == 'payment') return 2;
    if (curr_status == 'confirm') return 3;
    if (curr_status == 'completed') return 4;

    return 0;
  }

  const handleSubmit = () => {
    if (transaction?.status === 'payment') {
      updateTransaction.mutate(
        {
          status: 'confirm',
        },
        {
          onError: (error) => {
            showErrorNotification(error.response?.data?.details || 'Error');
          },
          onSuccess: () => {
            showSuccessNotification('Transaction status successfully updated');
          },
          onSettled: () => onClose(),
        },
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3}>Update the payment status</Title>
      }
      centered
    >
      <Stack>
        {transaction?.status === 'payment' && (
          <Stack px='sm'>
            <Stepper size="md" active={getCurrentStage(transaction.status)} orientation="vertical" pt='md'>
              <Stepper.Step label="Pending" description="The transaction has been successfully created. Waiting for the wholesaler to enter the details." />
              <Stepper.Step label="Payment" description="Plase proceed with the payment." />
              <Stepper.Step label="Confirm" description="Waiting for the payment confirmation from the wholesaler." />
              <Stepper.Step label="Completed" description="The payment process is complete!" />
            </Stepper>
          </Stack>
        )}

        <Group mt='md' position='right'>
          <Button variant='default' onClick={onClose}>
            Cancel
          </Button>
          <Button color='green' onClick={handleSubmit}>
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ChangeTransactionModal;
