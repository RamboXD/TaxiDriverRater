import {
  ActionIcon,
  Group,
  Image,
  Input,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useCart } from 'hooks/cart/useCart';
import { useEffect, useRef } from 'react';
import { Advert } from 'types/generated';
import { showErrorNotification, showSuccessNotification } from 'utils/notifications';

interface SortCardProps {
  advert: Advert
}

const SortCard = ({
  advert
}: SortCardProps) => {
  const theme = useMantineTheme();
  const {addItem, getVolume} = useCart()
  const volume = useRef<HTMLInputElement>(null);

  const addToCart = () => {
    if (volume.current) {
      const currVolume = Number(volume.current.value);
      if (currVolume > 0 && currVolume <= advert.qualitiesOfAdvert[0].volume) {
        addItem(advert, currVolume)
        showSuccessNotification("Item was successfully added to the cart!")
      } else {
        showErrorNotification("Please enter a value volume!")
      }
    }
  }

  useEffect(() => {
    if (volume.current) {
      const newVolume = getVolume(advert.id)
      if (newVolume) volume.current.value = newVolume
    }
  }, [volume])

  return (
    <Paper shadow='md' sx={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
      <Image src={advert.sort.imageUrl} width='100%' height={160} alt={advert.sort.name} />
      <Stack pt='xs' pb='sm' px='md' spacing='xs'>
        <Title order={5} weight={700}>
          {advert.sort.name}
        </Title>
        <Stack spacing={0}>
          <Text color='dimmed' size='sm' lh={1.2}>
            {`Available volume: ${advert.qualitiesOfAdvert[0].volume}`}
          </Text>
          <Text color='dimmed' size='sm' lh={1.2}>
            {`Price: ${advert.qualitiesOfAdvert[0].priceSell} €`}
          </Text>
        </Stack>
        <Group spacing="xs">
          <Input
            ref={volume}
            sx={{flex: 1}}
            placeholder='Enter volume'
            min={0}
            type="number"
          />
          <ActionIcon
            onClick={addToCart}
            variant='light'
            color='yellow'
            size='lg'
          >
            <IconShoppingCart size={theme.fontSizes.xl} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  );
};

export default SortCard;
