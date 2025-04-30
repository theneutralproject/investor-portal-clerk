import { SIDEBAR_TEST_ID } from 'e2e/testIds';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';

export const USER_ROUTES = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-dashboard`,
  },
  {
    name: 'Documents',
    path: '/documents/investor',
    icon: DescriptionIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-documents`,
  },
  {
    name: 'Learn',
    path: '/learn',
    icon: InfoIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-learn`,
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: MessageIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-contact`,
  },
];

export const ADVISOR_ROUTES = [
  {
    name: 'Advisor Dashboard',
    path: '/advisor/dashboard',
    icon: HomeIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-advisor-dashboard`,
  },
  {
    name: 'Documents',
    path: '/advisor/documents',
    icon: DescriptionIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-advisor-documents`,
  },
  {
    name: 'Resource Center',
    path: '/advisor/faq',
    icon: InfoIcon,
    dataTestId: `${SIDEBAR_TEST_ID}-advisor-faq`,
  },
];
