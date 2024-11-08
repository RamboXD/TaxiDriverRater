import {
  Avatar,
  Badge,
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
import { CompanyProfile, OwnerProfile, UserProfile } from 'types/generated';

import ModalCompanyUpdateFrom from './ModalCompanyUpdateFrom.tsx';
import ModalProfileUpdateFrom from './ModalProfileUpdateForm.tsx';

const GeneralCard = () => {
  const theme = useMantineTheme();

  const {
    profile,
    ownerProfile,
    companyProfile,
  }: {
    profile: UserProfile;
    ownerProfile: OwnerProfile;
    companyProfile: CompanyProfile;
  } = useAuth();

  const [
    isUpdateProfileFormOpened,
    { close: closeUpdateProfileForm, open: openUpdateProfileForm },
  ] = useDisclosure(false);
  const [
    isUpdateCompanyFormOpened,
    { close: closeUpdateCompanyForm, open: openUpdateCompanyForm },
  ] = useDisclosure(false);

  return (
    <>
      <Stack spacing='xs'>
        <Title order={5}>Account</Title>
        <Paper p='sm' shadow='xs' radius='lg'>
          <Group position='apart' noWrap>
            <Group spacing='lg'>
              <Avatar src='' radius='xl' size='lg' />

              <Flex direction='column'>
                <Text size='md' weight={600}>
                  {`${ownerProfile.firstName} ${ownerProfile.lastName}`}
                </Text>
                <Text size='md'>{profile.email}</Text>
              </Flex>

              <Badge color={ownerProfile.verified ? 'green' : 'orange'}>
                {ownerProfile.verified ? 'Verified' : 'Not Verified'}
              </Badge>
            </Group>
            <Menu shadow='md' width={200}>
              <Menu.Target>
                <Button
                  size='xs'
                  ml='auto'
                  rightIcon={<IconChevronDown size={theme.fontSizes.lg} />}
                >
                  Actions
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={openUpdateProfileForm}>
                  Update profile
                </Menu.Item>
                <Menu.Item disabled>Change password</Menu.Item>
                <Menu.Item disabled>Upload profile picture</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Paper>
      </Stack>

      <Stack spacing='xs'>
        <Title order={5}>Company</Title>
        <Paper p='sm' shadow='xs' radius='lg'>
          <Group position='apart' noWrap>
            <Group spacing='lg'>
              <Avatar color='green' radius='xl' size='lg'>
                {companyProfile.name[0]?.toUpperCase()}
              </Avatar>

              <Flex direction='column'>
                <Text size='md' weight={600}>
                  {companyProfile.name}
                </Text>
                <Text size='md'>{companyProfile.email}</Text>
              </Flex>
            </Group>
            <Menu shadow='md' width={200}>
              <Menu.Target>
                <Button
                  size='xs'
                  ml='auto'
                  rightIcon={<IconChevronDown size={theme.fontSizes.lg} />}
                >
                  Actions
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={openUpdateCompanyForm}>
                  Update Company Profile
                </Menu.Item>
                <Menu.Item disabled>Upload profile picture</Menu.Item>
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

      <ModalProfileUpdateFrom
        title={`Update User Profile`}
        opened={isUpdateProfileFormOpened}
        onClose={closeUpdateProfileForm}
      />

      <ModalCompanyUpdateFrom
        title={`Update Company Profile`}
        opened={isUpdateCompanyFormOpened}
        onClose={closeUpdateCompanyForm}
      />
    </>
  );
};

export default GeneralCard;
