import {
  Image,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  img: string;
  name: string;
  volume: number;
  sortCount: number;
}

const ProductCard = ({
  id,
  img,
  name,
  volume,
  sortCount,
}: ProductCardProps) => {
  const navigate = useNavigate()

  const handleRedirect = () => {
    navigate(`sorts/${id}`)
  }

  return (
    <Paper shadow='md' sx={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
      <Stack onClick={handleRedirect}>
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
              {`Number of sorts: ${sortCount}`}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProductCard;
