import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bytewave Technology',
  description: 'Building workforce excellence through innovation and expertise',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}