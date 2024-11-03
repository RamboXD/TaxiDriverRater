import { useState } from 'react';

import {
  Avatar,
  Button,
  Checkbox,
  createStyles,
  Flex,
  Paper,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const items = [
  {
    description: 'Owns wholesale',
    title: 'Wholesale Owner',
    emoji: '👨‍🌾',
    link: '/login/farmer',
  },
  {
    description: 'Owns business',
    title: 'Business Owner',
    emoji: '👩‍💼',
    link: '/login/business',
  },
];

const useStyles = createStyles((theme) => ({
  button: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    transition: 'background-color 150ms ease, border-color 150ms ease',
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    border: `${rem(1)} solid ${theme.colors.gray[3]}`,
    backgroundColor: theme.white,

    '&[data-checked]': {
      borderColor: theme.colors.green[4],
      backgroundColor: theme.colors.green[0],
    },
    '&:disabled': {
      backgroundColor: theme.colors.gray[0],
      cursor: 'initial',
    },
  },

  body: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
}));

const LoginRoleSelect = () => {
  const { classes, theme } = useStyles();

  const [value, setValue] = useState<string | undefined>();

  return (
    <Paper maw={520} w='100%' m='0 auto'>
      <Stack spacing='xl'>
        <Flex direction='column' align='center'>
          <Title weight={700}>Welcome back!</Title>
          <Text color='dimmed'>Select role and tap continue button</Text>
        </Flex>

        <SimpleGrid
          cols={2}
          spacing='xs'
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { minWidth: 'md', cols: 2 },
          ]}
        >
          {items.map(({ title, description, emoji, link }) => {
            const checked = value === link;
            return (
              <UnstyledButton
                key={link}
                onClick={() => setValue(link)}
                data-checked={checked || undefined}
                className={classes.button}
              >
                <Avatar size='lg' radius='xl'>
                  <Title>{emoji}</Title>
                </Avatar>

                <div className={classes.body}>
                  <Text c='dimmed' size='xs' lh={1} mb={5}>
                    {description}
                  </Text>
                  <Text fw={500} size='sm' lh={1}>
                    {title}
                  </Text>
                </div>

                <Checkbox
                  checked={checked}
                  onChange={() => {}}
                  tabIndex={-1}
                  styles={{
                    input: { cursor: 'pointer' },
                  }}
                />
              </UnstyledButton>
            );
          })}
        </SimpleGrid>

        <Button
          component={Link}
          to={value || ''}
          disabled={!value}
          rightIcon={<IconChevronRight size={theme.fontSizes.lg} />}
        >
          Continue
        </Button>
      </Stack>
    </Paper>
  );
};

export default LoginRoleSelect;
