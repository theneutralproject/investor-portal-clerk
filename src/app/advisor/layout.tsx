import '@/styles/globals.css';
import Sidebar from '@/components/Shell/Sidebar';
import { ADVISOR_ROUTES } from '@/constants/routes';
import { AdvisorProvider } from '../context/AdvisorContext';

export const metadata = {
  title: 'Advisor Portal',
  description: 'Advisor Portal | Neutral',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdvisorProvider>
      <Sidebar routes={ADVISOR_ROUTES} isAdvisor>
        {children}
      </Sidebar>
    </AdvisorProvider>
  );
}
