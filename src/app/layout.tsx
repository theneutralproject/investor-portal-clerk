import "@/styles/globals.css";

import { Inter } from "next/font/google";

import NeutralThemeProvider from "@/components/Shell/NeutralThemeProvider";
import Sidebar from "@/components/Shell/Sidebar";
import NeutralQueryProvider from "@/components/QueryClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Investor Portal",
  description: "Investor Portal | The Neutral Project",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
        </body>
      </html>
    </ClerkProvider>
  );
}
