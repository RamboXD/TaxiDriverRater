import {
  Image,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Product } from 'types/generated';

interface ProductCardProps {
  advert: Product;
}

const ProductCard = ({ advert }: ProductCardProps) => {
  const navigate = useNavigate()

  const handleRedirect = () => {
    navigate(`sorts/${advert.id}`)
  }

  return (
    <Paper shadow='md' sx={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
      <Stack onClick={handleRedirect}>
        <Image
          src={advert.imageUrl}
          width='100%'
          height={160}
          alt={advert.name}
        />
        <Stack pt='xs' pb='sm' px='md' spacing='xs'>
          <Title order={5} weight={700}>
            {advert.name}
          </Title>
          <Stack spacing={0}>
            <Text color='dimmed' size='sm' lh={1.2}>
              {`Number of sorts: ${advert.sortsWithAdvertsCount}`}
            </Text>
            <Text color='dimmed' size='sm' lh={1.2}>
              {`Total volume: ${advert.totalAdvertsVolume}`}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProductCard;
