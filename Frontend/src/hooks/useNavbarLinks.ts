import {
  IconBasket,
  IconBell,
  IconBuilding,
  IconCopy,
  IconFileDescription,
  IconHome,
  IconNotes,
  IconSettings,
  IconShoppingCart,
  TablerIconsProps,
} from '@tabler/icons-react';

import { UserProfile } from '../types/generated';

type NavbarLink = {
  label: string;
  path: string;
  Icon: (props: TablerIconsProps) => JSX.Element;
};

const superAdminItems: NavbarLink[] = [
  {
    label: 'Главная',
    path: '/',
    Icon: IconHome,
  },
  {
    label: 'Компании',
    path: '/companies',
    Icon: IconBuilding,
  },
  {
    label: 'Водители',
    path: '/drivers',
    Icon: IconNotes,
  },
  // {
  //   label: 'Billing',
  //   path: '/billing',
  //   Icon: IconCopy,
  // },
  // {
  //   label: 'Settings',
  //   path: '/settings',
  //   Icon: IconSettings,
  // },
];

const companyAdminItems: NavbarLink[] = [
  {
    label: 'Главная',
    path: '/',
    Icon: IconHome,
  },
  {
    label: 'Компания',
    path: '/company',
    Icon: IconBuilding,
  },
  {
    label: 'Водители',
    path: '/drivers',
    Icon: IconNotes,
  },
  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  //   Icon: IconBell,
  // },
  // {
  //   label: 'Cart',
  //   path: '/cart',
  //   Icon: IconShoppingCart,
  // },
  // {
  //   label: 'Orders',
  //   path: '/orders',
  //   Icon: IconFileDescription,
  // },
  // {
  //   label: 'Branches',
  //   path: '/branches',
  //   Icon: IconBuilding,
  // },
  // {
  //   label: 'Billing',
  //   path: '/billing',
  //   Icon: IconCopy,
  // },
  // {
  //   label: 'Staffs',
  //   path: '/staffs',
  //   Icon: IconUsers,
  // },
  // {
  //   label: 'Settings',
  //   path: '/settings',
  //   Icon: IconSettings,
  // },
];

const workerItems: NavbarLink[] = [
  {
    label: 'Home',
    path: '/',
    Icon: IconHome,
  },
  {
    label: 'Водители',
    path: '/drivers',
    Icon: IconNotes,
  },
  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  //   Icon: IconBell,
  // },
  // {
  //   label: 'Cart',
  //   path: '/cart',
  //   Icon: IconShoppingCart,
  // },
  // {
  //   label: 'Orders',
  //   path: '/orders',
  //   Icon: IconFileDescription,
  // },
  // {
  //   label: 'Settings',
  //   path: '/settings',
  //   Icon: IconSettings,
  // },
];

export default function useNavbarLinks(
  role: UserProfile['role'],
): NavbarLink[] {
  if (role === 'super_admin') {
    return superAdminItems;
  }
  if (role === 'company_admin') {
    return companyAdminItems;
  }
  if (role === 'worker') {
    return workerItems;
  }

  return [];
}
