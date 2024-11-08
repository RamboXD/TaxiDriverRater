import { Button, Group, Modal, ModalProps, Stepper, Text, Title } from '@mantine/core';
import useUpdateOrderStatus from 'hooks/order/useUpdateOrderStatus';
import { Order } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

interface ModalDeleteFarmProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  orderId: string;
  status: string;
}

const ModalEditOrder = ({
  opened,
  onClose,
  orderId,
  status,
}: ModalDeleteFarmProps) => {
  const updateOrderStatus = useUpdateOrderStatus();

  const getCurrentStage = (curr_status: string): number => {
    if (curr_status == 'created') return 1;
    if (curr_status == 'approved') return 2;
    if (curr_status == 'packaging') return 3;
    if (curr_status == 'delivery') return 4;
    if (curr_status == 'finished') return 5;

    return 0;
  }

  const next = (curr_status: string) => {
    if (curr_status === 'delivery') return 'finished';

    return 'canceled';
  };

  const handleChangeStatus = (new_status: string) => {
    if (orderId) {
      updateOrderStatus.mutate(
        { status: new_status as Order['status'], orderId },
        {
          onSuccess: () => {
            showSuccessNotification('Order status has been changed');
            onClose();
          },
          onError: () => {
            showErrorNotification('Order status change failed');
          },
        },
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Edit status of the order</Title>}
      centered
    >
      {status != 'delivery' ? (
        <>
          <Text>{`Are you sure that you want to cancel the order?`}</Text>
          <Group mt='md' position='right'>
            <Button onClick={() => onClose()}>
              Close
            </Button>
            <Button color='red' onClick={() => handleChangeStatus('canceled')}>
              Cancel
            </Button>
          </Group>
        </>
      ) : (
        <>
          <Stepper size="md" active={getCurrentStage(status)} orientation="vertical" px='md' pt='md'>
            <Stepper.Step label="Created" description="Order has been successfully created." />
            <Stepper.Step label="Approved" description="You have accepted the order for further processing." />
            <Stepper.Step label="Packaging" description="Order is currently being packaged and prepared for shipment." />
            <Stepper.Step label="Delivery" description="Order is out for delivery and will be arriving to its destination soon." />
            <Stepper.Step label="Finished" description="Order has been successfully delivered and the process is now complete." />
          </Stepper>
          <Group mt='md' position='right'>
            <Button variant='default' onClick={onClose}>
              Cancel
            </Button>
            <Button
              color='green'
              onClick={() => handleChangeStatus(next(status))}
            >
              Confirm
            </Button>
          </Group>
        </>
      )}
    </Modal>
  );
};

export default ModalEditOrder;
