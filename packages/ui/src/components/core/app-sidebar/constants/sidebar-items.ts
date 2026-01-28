import { Permission } from '@repo/ui/constants/roles-permissions';

import {
  BarChart,
  BookIcon,
  CalendarRange,
  Library,
  MapPinned,
  type LucideIcon,
} from 'lucide-react';
export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  permission?: Permission[];
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  permission?: Permission[];
}

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: 'Dashboard',
    items: [
      {
        title: 'Analysis Report',
        url: '/report',
        icon: BarChart,
        permission: [],
        subItems: [
          {
            title: 'Library Based Report',
            url: '/report/library',
            icon: Library,
            permission: [],
          },
          {
            title: 'Location Based Report',
            url: '/report/area-report',
            icon: MapPinned,
            permission: [],
          },
          {
            title: 'Annual Growth Report',
            url: '/report/yearly',
            icon: CalendarRange,
            permission: [],
          },
          {
            title: 'Book Sales Report',
            url: '/report/book-report',
            icon: BookIcon,
          },
        ],
      },
    ],
  },
];
