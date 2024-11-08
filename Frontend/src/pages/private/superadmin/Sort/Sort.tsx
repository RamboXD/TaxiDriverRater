import { useEffect, useState } from 'react';

import {
  Avatar,
  Center,
  Divider,
  Flex,
  Grid,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme
} from '@mantine/core';
import { IconFileAlert, IconSearch } from '@tabler/icons-react';
import EmptyState from 'components/states/EmptyState';
import { Advert } from 'types/generated/index';

import useSorts from 'hooks/sort/useSort.tsx';
import { useParams } from 'react-router-dom';

import SortCard from './components/SortCard';

const Sort = () => {
  const theme = useMantineTheme();
  const { id } = useParams();
  const [sorts, setSorts] = useState<Advert[]>([]);

  const [search, setSearch] = useState('');

  const { data, isLoading, isSuccess, isError, error } = useSorts(id);


  useEffect(() => {
    if (isSuccess && data?.data) {
      setSorts(data.data.results);
    }
  }, [isSuccess, data?.data]);

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Products Sorts</Title>
        <Text color='dimmed'>All sorts for this product</Text>
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
      </Grid>

      {isLoading && (
        <Center mt='xl'>
          <Loader />
        </Center>
      )}

      {isSuccess && sorts.length === 0 && (
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
        {sorts.map((advert) => (
          <SortCard
            key={advert.id}
            advert={advert}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Sort;
