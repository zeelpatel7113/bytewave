import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';
import ServiceProvider from '@/providers/ServiceProvider';
import { TrainingProvider } from '@/providers/TrainingProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ByteWave - Technology Solutions',
  description: 'Professional technology services and training solutions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <ServiceProvider>
            <TrainingProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </TrainingProvider>
          </ServiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}