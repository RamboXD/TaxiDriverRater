import {
  Avatar,
  Button,
  Flex,
  Group,
  Menu,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrightnessUp,
  IconChevronDown,
  IconLanguageHiragana,
} from '@tabler/icons-react';
import { useAuth } from 'contexts/AuthContext';
import { GmOwner, UserProfile } from 'types/generated';

import EditGeneralModal from './EditGeneralModal.tsx';

const GeneralCard = () => {
  const theme = useMantineTheme();

  const {
    profile,
    farmerProfile,
  }: { profile: UserProfile; farmerProfile: GmOwner } = useAuth();

  const [
    isEditGeneralOpened,
    { open: openEditGeneral, close: closeEditGeneral },
  ] = useDisclosure(false);

  return (
    <>
      <Stack spacing='xs'>
        <Title order={5}>Account</Title>
        <Paper p='sm' shadow='xs' radius='lg'>
          <Group position='apart' noWrap>
            <Group spacing='xs'>
              <Avatar radius='xl' size='lg' />

              <Flex direction='column'>
                <Text size='md' weight={600}>
                  {`${farmerProfile.firstName} ${farmerProfile.lastName}`}
                </Text>
                <Text size='sm' color='dimmed'>
                  {profile.phone}
                </Text>
              </Flex>
            </Group>
            <Menu shadow='xs' width={200}>
              <Menu.Target>
                <Button
                  ml='auto'
                  rightIcon={<IconChevronDown size={theme.fontSizes.lg} />}
                >
                  Actions
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={openEditGeneral}>Edit General</Menu.Item>
                <Menu.Item disabled>Upload Avatar</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Paper>
      </Stack>

      <Stack spacing='xs'>
        <Title order={5}>General</Title>
        <Paper p='md' shadow='xs' radius='lg'>
          <SimpleGrid
            cols={4}
            breakpoints={[
              {
                maxWidth: 'sm',
                cols: 2,
              },
            ]}
          >
            <Select
              icon={<IconLanguageHiragana size={theme.fontSizes.lg} />}
              label='Language'
              defaultValue='EN'
              data={['EN']}
            />
            <Select
              icon={<IconBrightnessUp size={theme.fontSizes.lg} />}
              label='Theme'
              defaultValue='light'
              data={['light']}
            />
          </SimpleGrid>
        </Paper>
      </Stack>

      {isEditGeneralOpened && (
        <EditGeneralModal
          farmerProfile={farmerProfile}
          opened={isEditGeneralOpened}
          onClose={closeEditGeneral}
        />
      )}
    </>
  );
};

export default GeneralCard;
