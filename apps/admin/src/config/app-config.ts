import packageJson from '../../package.json';

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: 'EduManage',
  version: packageJson.version,
  copyright: `© ${currentYear}, EduManage.`,
  meta: {
    title: 'EduManage - Student Management System',
    description:
      'EduManage is a modern student management system built with Next.js, TypeScript, and NestJS. Manage students, enrollments, courses, batches, and results with ease.',
  },
};
