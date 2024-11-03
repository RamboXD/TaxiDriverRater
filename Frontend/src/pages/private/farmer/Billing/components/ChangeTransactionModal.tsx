import { useState } from 'react';

import {
  Button,
  Group,
  Modal,
  ModalProps,
  NumberInput,
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
  const [coefficientValue, setCoefficientValue] = useState<number>(
    (transaction?.nonCashCoef || 0) * 100,
  );

  const getCurrentStage = (curr_status: string): number => {
    if (curr_status == 'pending') return 1;
    if (curr_status == 'payment') return 2;
    if (curr_status == 'confirm') return 3;
    if (curr_status == 'completed') return 4;

    return 0;
  }

  const updateTransaction = useUpdateTransaction(transaction?.id);

  const handleSubmit = () => {
    if (transaction?.status === 'pending') {
      updateTransaction.mutate(
        {
          nonCashCoef: coefficientValue / 100,
          status: 'payment',
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
    if (transaction?.status === 'confirm') {
      updateTransaction.mutate(
        {
          status: 'completed',
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
        {transaction && <Stack px='sm'>
          <Stepper size="md" active={getCurrentStage(transaction.status)} orientation="vertical" pt='md'>
            <Stepper.Step label="Pending" description="The transaction has been successfully created. Please specify the amount to be paid by bank card." />
            <Stepper.Step label="Payment" description="Awaiting payment from the company." />
            <Stepper.Step label="Confirm" description="Please confirm that you have received the payment." />
            <Stepper.Step label="Completed" description="The payment process is complete!" />
          </Stepper>
          {transaction.status === 'pending' && <NumberInput
            size='sm'
            label="Set part to be paid by bank"
            value={coefficientValue}
            onChange={(v) => setCoefficientValue(v as number)}
            parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
            formatter={(v) =>
              !Number.isNaN(parseFloat(v))
                ? `${v} %`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                : ' %'
            }
          />}
        </Stack>}

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
