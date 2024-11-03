import { Button, Group, Modal, ModalProps, Text } from '@mantine/core';
import { useCart } from 'hooks/cart/useCart';
import { Advert } from 'types/generated';

interface ModalDeleteCartProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  selectedItems: string[];
  setOrdersData: React.Dispatch<React.SetStateAction<Advert[]>>
  orders: Advert[]
}

const ModalDeleteCart = ({
  orders,
  opened,
  onClose,
  selectedItems,
  setOrdersData
}: ModalDeleteCartProps) => {
  const {removeItem} = useCart()

  const handleDelete = () => {
    if (selectedItems.length) {
      selectedItems.forEach((advertId) => {
        removeItem(advertId)
        setOrdersData(orders.filter((advert) => advert.id !== advertId))
      })
    } else {
      setOrdersData([])
      localStorage.removeItem("cart")
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="xl" fw={700}>Delete orders</Text>}
      centered
    >
      <Text>{`Are you sure you want to delete selected orders?`}</Text>
      <Group mt='md' position='right'>
        <Button variant='default' onClick={onClose}>
          Cancel
        </Button>
        <Button color='red' onClick={handleDelete}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalDeleteCart;
