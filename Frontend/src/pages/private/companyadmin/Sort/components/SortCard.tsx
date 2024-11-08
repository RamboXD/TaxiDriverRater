import {
  ActionIcon,
  Group,
  Image,
  Menu,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';

interface SortCardProps {
  img: string;
  name: string;
  volume: number;
  price: number;
  handleEdit: () => void;
  handleDelete: () => void;
}

const SortCard = ({
  img,
  name,
  volume,
  price,
  handleEdit,
  handleDelete
}: SortCardProps) => {
  const theme = useMantineTheme();

  return (
    <Paper shadow='md' sx={{ position: 'relative', overflow: 'hidden' }}>
      <Group
        position='right'
        pt='xs'
        px='xs'
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Menu withinPortal position='bottom-end' shadow='sm'>
          <Menu.Target>
            <ActionIcon size='md' variant='light'>
              <IconDots size={theme.fontSizes.lg} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={handleEdit}
              icon={<IconEdit size={theme.fontSizes.lg} />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              icon={<IconTrash size={theme.fontSizes.lg} />}
              color='red'
              onClick={handleDelete}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Image src={img} width='100%' height={160} alt={name} />

      <Stack pt='xs' pb='sm' px='md' spacing='xs'>
        <Title order={5} weight={700}>
          {name}
        </Title>
        <Stack spacing={0}>
          <Text color='dimmed' size='sm' lh={1.2}>
            {`Total Volume: ${volume}`}
          </Text>
          <Text color='dimmed' size='sm' lh={1.2}>
            {`Price: ${price} €`}
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SortCard;
