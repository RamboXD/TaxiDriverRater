import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconEdit,
  IconPlus,
  IconBuilding,
  IconFileAlert,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import EmptyState from 'components/states/EmptyState';
import {
  DriverProfile,
  UserProfile,
  RatingWithCompany,
} from 'types/profileTypes';
import { useAuth } from 'contexts/AuthContext';
import DrawerRatingForm from './components/DrawerRatingForm';
import useDriverWithRatings from 'hooks/drivers/useDriverWithRatings';

const DriverProfilePage = () => {
  const theme = useMantineTheme();
  const { id: driverId } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [ratings, setRatings] = useState<RatingWithCompany[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const { profile }: { profile: UserProfile } = useAuth();
  const userCompanyId = profile.company?.ID;

  const { data, isLoading, isSuccess, isError } =
    useDriverWithRatings(driverId);

  const [isRatingFormOpened, { open: openRatingForm, close: closeRatingForm }] =
    useDisclosure(false);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isSuccess && data?.data) {
      setDriver(data.data.driver);
      setRatings(data.data.ratings);
      setAverageRating(data.data.average_rating);
    }
  }, [isSuccess, data?.data]);

  const userRating = ratings.find(
    (rating) => rating.Rating.CompanyID === userCompanyId,
  );

  const handleEditRating = () => {
    setIsEditing(true);
    openRatingForm();
  };

  const handleCreateRating = () => {
    setIsEditing(false);
    openRatingForm();
  };

  return (
    <Stack>
      <Flex direction='column'>
        <Title weight={700}>Профиль водителя</Title>
        <Text color='dimmed'>Информация о водителе и отзывы</Text>
      </Flex>
      <Divider my='md' />
      {isLoading && (
        <Center mt='xl'>
          <Loader />
        </Center>
      )}
      {isError && (
        <EmptyState
          mt='xl'
          title='Ошибка'
          description='Произошла ошибка при получении данных.'
          Icon={
            <Avatar radius='100%' size='xl' variant='light' color='red'>
              <IconFileAlert size={25} />
            </Avatar>
          }
        />
      )}
      {isSuccess && driver && (
        <>
          <Card shadow='sm' p='lg' radius='md' withBorder>
            <Group position='apart'>
              <Stack spacing='xs'>
                <Title order={2}>
                  {driver.Name} {driver.Surname} {driver.Patronymic}
                </Title>
                <Group spacing='xs'>
                  <Badge color='blue' variant='light'>
                    Категория: {driver.Category}
                  </Badge>
                  {driver.Penalty && (
                    <Badge color='red' variant='light'>
                      Имеются штрафы
                    </Badge>
                  )}
                </Group>
                <Text size='sm' color='dimmed'>
                  ИИН: {driver.IIN}
                </Text>
                <Text size='sm' color='dimmed'>
                  Телефон: {driver.PhoneNumber}
                </Text>
                <Text size='sm' color='dimmed'>
                  Адрес: {driver.Address}
                </Text>
              </Stack>
              <Stack align='center'>
                <Text size='sm' color='dimmed'>
                  Средний рейтинг
                </Text>
                <Rating
                  value={averageRating || 0}
                  fractions={2}
                  readOnly
                  size='xl'
                />
                <Text size='sm' weight={500}>
                  {averageRating?.toFixed(1) || 'Нет рейтингов'}
                </Text>
              </Stack>
            </Group>
          </Card>

          <Flex direction='column' mt='xl'>
            <Title order={3}>Отзыв компаний</Title>
            {userRating ? (
              <Card shadow='sm' p='md' radius='md' mt='sm' withBorder>
                <Group position='apart'>
                  <Rating value={userRating.Rating.Rating} readOnly size='md' />
                </Group>
                <Text mt='sm'>{userRating.Rating.Description}</Text>
                <Text size='xs' color='dimmed' mt='sm'>
                  {new Date(userRating.Rating.UpdatedAt).toLocaleDateString()}
                </Text>
              </Card>
            ) : (
              <Group position='center' my='md'>
                <Button
                  leftIcon={<IconPlus size={16} />}
                  variant='light'
                  color='blue'
                  onClick={handleCreateRating}
                >
                  Добавить отзыв
                </Button>
              </Group>
            )}
          </Flex>

          <Title order={3} mt='xl'>
            Отзывы других компаний
          </Title>
          <Divider my='sm' />
          {ratings.filter((r) => r.Rating.CompanyID !== userCompanyId).length >
          0 ? (
            <Stack spacing='md'>
              {ratings
                .filter((rating) => rating.Rating.CompanyID !== userCompanyId)
                .map((rating) => (
                  <Card
                    key={rating.Rating.ID}
                    shadow='xs'
                    p='md'
                    radius='md'
                    withBorder
                  >
                    <Group align='flex-start'>
                      <Avatar color='blue' radius='xl'>
                        <IconBuilding size={24} />
                      </Avatar>
                      <Stack spacing={0} sx={{ flex: 1 }}>
                        <Group position='apart'>
                          <Text weight={500}>{rating.Company.Name}</Text>
                          <Rating
                            value={rating.Rating.Rating}
                            readOnly
                            size='sm'
                          />
                        </Group>
                        <Text size='sm' color='dimmed'>
                          {rating.Company.Address}
                        </Text>
                        <Text mt='sm'>{rating.Rating.Description}</Text>
                        <Text size='xs' color='dimmed' mt='sm'>
                          {new Date(
                            rating.Rating.CreatedAt,
                          ).toLocaleDateString()}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ))}
            </Stack>
          ) : (
            <EmptyState
              mt='xl'
              title='Нету данных'
              description=''
              Icon={
                <Avatar radius='100%' size='xl' variant='light' color='red'>
                  <IconFileAlert size={25} />
                </Avatar>
              }
            />
          )}

          <DrawerRatingForm
            opened={isRatingFormOpened}
            onClose={closeRatingForm}
            title={isEditing ? 'Редактировать отзыв' : 'Добавить отзыв'}
            driverId={driverId}
            isEditing={isEditing}
            initialRating={userRating?.Rating || null}
          />
        </>
      )}
    </Stack>
  );
};

export default DriverProfilePage;
