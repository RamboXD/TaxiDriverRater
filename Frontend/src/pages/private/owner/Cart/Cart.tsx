import { useEffect, useState } from 'react';

import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCreditCard,
  IconShoppingCart,
  IconTrash,
} from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import Table from 'components/Table';
import { Advert } from 'types/generated';

import { useCart } from 'hooks/cart/useCart.tsx';
import DrawerCartPayment from './components/DrawerCartPayment.tsx';
import ModalDeleteCart from './components/ModalDeleteCart.tsx';

const Cart = (): JSX.Element => {
  const theme = useMantineTheme();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [ordersData, setOrdersData] = useState<Advert[]>([]);

  const [
    isDeleteModalOpened,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);
  const [
    isPaymentFormOpened,
    { close: closePaymentForm, open: openPaymentForm },
  ] = useDisclosure(false);

  const { cart: data } = useCart();

  const selectedItemsLength = selectedItems.length;
  const ordersLength = ordersData.length;

  const handleClearSelectedItems = () => {
    setSelectedItems([]);
  };

  const handleCheckbox = (itemId: string) => {
    if (!selectedItems.includes(itemId)) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleCloseDeleteModal = () => {
    setSelectedItems([]);
    closeDeleteModal();
  };

  const handleClosePaymentModal = () => {
    setSelectedItems([]);
    closePaymentForm();
  };
  const updateOrdersData = (newData: Advert[]) => {
    setOrdersData(newData);
  };

  const columns = [
    {
      Header: 'Product',
      accessor: 'product.name',
    },
    {
      Header: 'Sort',
      accessor: 'sort.name',
    },
    {
      Header: 'Quality',
      accessor: 'qualitiesOfAdvert[0].name',
    },
    {
      Header: 'Price',
      accessor: 'qualitiesOfAdvert[0].priceSell',
    },
    {
      Header: 'Volume',
      accessor: 'qualitiesOfAdvert[0].volume',
    },
    {
      Header: 'Select',
      name: 'action',
      Cell: ({ row }: { row: { original: Advert } }) => (
        <Checkbox
          checked={selectedItems.includes(row.original.id)}
          onChange={() => handleCheckbox(row.original.id)}
        />
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      setOrdersData(data);
    }
  }, []);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Cart</Title>
        <Text color='dimmed'>Chosen products</Text>
      </Flex>

      <Divider my='md' />

      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <Button
          onClick={openPaymentForm}
          w='100%'
          leftIcon={<IconCreditCard size={theme.fontSizes.lg} />}
          disabled={!selectedItemsLength}
        >
          Order
        </Button>
        <Button
          color='red'
          onClick={openDeleteModal}
          disabled={!ordersLength}
          leftIcon={<IconTrash size={theme.fontSizes.lg} />}
        >
          {selectedItemsLength
            ? `Remove selected items (${selectedItemsLength})`
            : 'Remove all items'}
        </Button>
        <Button
          variant='outline'
          disabled={!selectedItemsLength}
          onClick={handleClearSelectedItems}
        >
          Cancel selections
        </Button>
      </SimpleGrid>

      <Paper sx={{ position: 'relative' }}>
        <Table
          data={ordersData}
          columns={columns}
          EmptyState={
            <>
              {ordersData.length === 0 && (
                <EmptyState
                  mt='xl'
                  title='No orders'
                  description='There are no orders to display.'
                  Icon={
                    <Avatar
                      radius='100%'
                      size='xl'
                      variant='light'
                      color='primary'
                    >
                      <IconShoppingCart size={25} />
                    </Avatar>
                  }
                />
              )}
            </>
          }
        />
      </Paper>

      <ModalDeleteCart
        orders={ordersData}
        selectedItems={selectedItems}
        setOrdersData={setOrdersData}
        opened={isDeleteModalOpened}
        onClose={handleCloseDeleteModal}
      />

      <DrawerCartPayment
        orders={ordersData}
        selectedItems={selectedItems}
        opened={isPaymentFormOpened}
        onClose={handleClosePaymentModal}
        onUpdateOrders={updateOrdersData}
      />
    </Stack>
  );
};

export default Cart;
