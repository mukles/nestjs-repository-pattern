import {
  Award,
  BookOpen,
  BookText,
  Calendar,
  ChartBar,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';

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
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        url: '/analytics',
        icon: ChartBar,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: 'Student Management',
    items: [
      {
        title: 'Students',
        url: '/students',
        icon: GraduationCap,
        subItems: [
          { title: 'All Students', url: '/students/list', comingSoon: true },
          { title: 'Add Student', url: '/students/create', comingSoon: true },
          { title: 'Bulk Import', url: '/students/import', comingSoon: true },
          {
            title: 'Student Groups',
            url: '/students/groups',
            comingSoon: true,
          },
        ],
      },
      {
        title: 'Enrollments',
        url: '/enrollments',
        icon: BookOpen,
        subItems: [
          {
            title: 'All Enrollments',
            url: '/enrollments/list',
            comingSoon: true,
          },
          {
            title: 'Enroll Student',
            url: '/enrollments/create',
            comingSoon: true,
          },
          {
            title: 'Transfer Requests',
            url: '/enrollments/transfers',
            comingSoon: true,
          },
        ],
      },
      {
        title: 'Attendance',
        url: '/attendance',
        icon: Calendar,
        comingSoon: true,
        isNew: true,
      },
    ],
  },
  {
    id: 3,
    label: 'Academic',
    items: [
      {
        title: 'Courses',
        url: '/courses',
        icon: BookText,
        subItems: [
          { title: 'All Courses', url: '/courses/list', comingSoon: true },
          { title: 'Create Course', url: '/courses/create', comingSoon: true },
          {
            title: 'Course Categories',
            url: '/courses/categories',
            comingSoon: true,
          },
        ],
      },
      {
        title: 'Batches',
        url: '/batches',
        icon: Users,
        comingSoon: true,
      },
      {
        title: 'Results',
        url: '/results',
        icon: Award,
        subItems: [
          { title: 'All Results', url: '/results/list', comingSoon: true },
          { title: 'Grade Entry', url: '/results/entry', comingSoon: true },
          { title: 'Report Cards', url: '/results/reports', comingSoon: true },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Staff',
    items: [
      {
        title: 'Teachers',
        url: '/teachers',
        icon: UserCheck,
        comingSoon: true,
      },
      {
        title: 'Users & Roles',
        url: '/users',
        icon: Shield,
        subItems: [
          { title: 'All Users', url: '/users/list', comingSoon: true },
          {
            title: 'Roles & Permissions',
            url: '/users/roles',
            comingSoon: true,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    label: 'Communication',
    items: [
      {
        title: 'Messages',
        url: '/messages',
        icon: MessageSquare,
        comingSoon: true,
        isNew: true,
      },
      {
        title: 'Announcements',
        url: '/announcements',
        icon: Megaphone,
        comingSoon: true,
        isNew: true,
      },
    ],
  },
];
