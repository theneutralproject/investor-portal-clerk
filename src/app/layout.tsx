import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import NeutralThemeProvider from '@/components/Shell/NeutralThemeProvider';
import Sidebar from '@/components/Shell/Sidebar';
import NeutralQueryProvider from '@/components/QueryClientProvider';
import { ClerkProvider } from '@clerk/nextjs';

import { ToastContainer } from 'react-toastify';

import SignInTOSModal from '@/components/Dashboard/SignInTOSModal';
import { DashboardProvider } from '@/components/Dashboard/DashboardContext';
import PageViewTracker from './PageViewTracker';
import UserIdentifier from './UserIdentifier';
import { TermsProvider } from '@/app/context/TermsContext';
import { HubspotChatProvider } from '@/components/HubspotChatProvider';
import { RedirectProvider } from './context/RedirectContext';
import { PostHogProvider } from './context/PostHogContext';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Investor Portal',
  description: 'Investor Portal | Neutral',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostHogProvider>
      <ClerkProvider>
        <RedirectProvider>
          <TermsProvider>
            <GoogleAnalytics gaId={process.env.GOOGLE_TAG_ID ?? ''} />
            <GoogleTagManager gtmId={process.env.GOOGLE_ADS_TAG_ID ?? ''} />
            <html lang="en">
              <body className={inter.className}>
                <PageViewTracker />
                <UserIdentifier />
                <NeutralQueryProvider>
                  <NeutralThemeProvider>
                    <HubspotChatProvider>
                      <SignInTOSModal />
                      <DashboardProvider>
                        <Sidebar>{children}</Sidebar>
                        <ToastContainer
                          position="top-right"
                          autoClose={5000}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          theme="light"
                        />
                      </DashboardProvider>
                    </HubspotChatProvider>
                  </NeutralThemeProvider>
                </NeutralQueryProvider>
              </body>
              <script
                type="text/javascript"
                src="https://forms.finixpymnts.com/finix.js"
                async
              ></script>
            </html>
          </TermsProvider>
        </RedirectProvider>
      </ClerkProvider>
    </PostHogProvider>
  );
}
