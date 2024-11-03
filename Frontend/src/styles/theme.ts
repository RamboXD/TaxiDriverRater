import { MantineThemeOverride } from '@mantine/core';

import Drawer from './override/Drawer';
import Input from './override/Input';
import LoadingOverlay from './override/LoadingOverlay';
import Notification from './override/Notification';

// https://mantine.dev/theming/theme-object/

const theme: MantineThemeOverride = {
  colorScheme: 'light',
  primaryColor: 'green',

  fontFamily: 'Karla, sans-serif',
  fontFamilyMonospace: 'Karla, sans-serif',
  // fontFamily: 'Inter, sans-serif',
  // fontFamilyMonospace: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },
  other: {
    fontWeights: {
      medium: 500,
      semibold: 600,
    },
  },

  // Determines whether elements that do not have pointer cursor by default
  // (checkboxes, radio, native select) should have it
  cursorType: 'pointer',

  // Default border-radius used for most elements
  defaultRadius: 'md',
  shadows: {
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  components: {
    Input,
    Notification,
    Drawer,
    LoadingOverlay,
  },
};

export default theme;
