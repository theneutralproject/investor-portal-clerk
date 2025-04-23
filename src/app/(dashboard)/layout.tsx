import { DashboardProvider } from '@/components/Dashboard/DashboardContext';
import Sidebar from '@/components/Shell/Sidebar';
import { USER_ROUTES } from '@/constants/routes';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <Sidebar routes={USER_ROUTES}>{children}</Sidebar>
    </DashboardProvider>
  );
}
