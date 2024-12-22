import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

import NeutralThemeProvider from '@/components/Shell/NeutralThemeProvider';
import Sidebar from '@/components/Shell/Sidebar';
import NeutralQueryProvider from '@/components/QueryClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

import ChatInterface from '@/components/ChatInterface';
import { CSPostHogProvider } from './providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Investor Portal',
  description: 'Investor Portal | The Neutral Project',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CSPostHogProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className}>
            <NeutralQueryProvider>
              <NeutralThemeProvider>
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
              </NeutralThemeProvider>
            </NeutralQueryProvider>

            <ChatInterface type="FAB" />
          </body>

          <GoogleAnalytics gaId={process.env.GOOGLE_TAG_ID ?? ''} />
          <script
            type="text/javascript"
            src="https://forms.finixpymnts.com/finix.js"
            async
          ></script>
        </html>
      </ClerkProvider>
    </CSPostHogProvider>
  );
}
