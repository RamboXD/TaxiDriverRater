import {
  Avatar,
  Center,
  Flex,
  Stack,
  StackProps,
  Text,
  Title,
} from '@mantine/core';
import { IconFileFilled } from '@tabler/icons-react';

interface IEmptyStateProps extends StackProps {
  title: string;
  description: string;
  Icon?: JSX.Element;
}

const EmptyState = ({
  title,
  description,
  Icon,
  ...stackProps
}: IEmptyStateProps): JSX.Element => {
  return (
    <Stack {...stackProps}>
      <Center>
        <Flex direction='column'>
          <Title color='dark.3' order={2} weight={700}>
            {title}
          </Title>
          <Text color='dimmed' weight={400}>
            {description}
          </Text>
        </Flex>
      </Center>

      <Center>
        {Icon || (
          <Avatar radius='100%' size='xl' variant='light' color='primary'>
            <IconFileFilled size={25} />
          </Avatar>
        )}
      </Center>
    </Stack>
  );
};

export default EmptyState;
