import { useEffect, useState } from 'react';

import {
  Avatar,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileAlert, IconPlus, IconSearch } from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import { Product } from 'types/generated/index';

import useProducts from 'hooks/product/useProducts.ts';
import DrawerAdvertWriteFrom from './components/DrawerAdvertWriteFrom.tsx';
import ProductCard from './components/ProductCard.tsx';

const Home = () => {
  const theme = useMantineTheme();

  const [adverts, setAdverts] = useState<Product[]>([]);

  const [search, setSearch] = useState('');

  const { data, isLoading, isSuccess, isError, error } = useProducts();

  const [
    isCreationFormOpened,
    { close: closeCreationForm, open: openCreationForm },
  ] = useDisclosure(false);

  useEffect(() => {
    if (isSuccess && data?.data) {
      setAdverts(data.data.results);
    }
  }, [isSuccess, data?.data]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>My Products</Title>
        <Text color='dimmed'>My products</Text>
      </Flex>

      <Divider my='md' />

      <Grid columns={10}>
        <Grid.Col sm={10} md={4}>
          <TextInput
            icon={<IconSearch size={theme.fontSizes.lg} />}
            placeholder='Search advert by product name'
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col sm={10} md={2} />
        <Grid.Col sm={10} md={4}>
          <Group position='right'>
            <Button
              leftIcon={<IconPlus size={theme.fontSizes.lg} />}
              onClick={openCreationForm}
            >
              Add advert
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      {isLoading && (
        <Center mt='xl'>
          <Loader />
        </Center>
      )}

      {isSuccess && adverts.length === 0 && (
        <EmptyState
          title='No adverts'
          description='There are no adverts to display.'
        />
      )}

      {isError && (
        <EmptyState
          mt='xl'
          title='Error'
          description={
            error?.response?.data.message ||
            'Something went wrong while fetching data.'
          }
          Icon={
            <Avatar radius='100%' size='xl' variant='light' color='red'>
              <IconFileAlert size={25} />
            </Avatar>
          }
        />
      )}

      <SimpleGrid
        mt='xl'
        spacing='lg'
        breakpoints={[
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 3 },
          { minWidth: 'lg', cols: 4 },
        ]}
        sx={{ position: 'relative' }}
      >
        {adverts.map((advert) => (
          <ProductCard
            id={advert.id}
            key={advert.id}
            img={advert.imageUrl}
            name={advert.name}
            volume={advert.totalAdvertsVolume}
            sortCount={advert.sortsWithAdvertsCount}
          />
        ))}
      </SimpleGrid>

      <DrawerAdvertWriteFrom
        opened={isCreationFormOpened}
        onClose={closeCreationForm}
        title='Advert Creation'
      />
    </Stack>
  );
};

export default Home;
