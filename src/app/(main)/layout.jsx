import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';
import ServiceProvider from '@/providers/ServiceProvider';
import { TrainingProvider } from '@/providers/TrainingProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata= {
  title: 'Bytewave Technology',
  description: 'Building digital excellence through innovation and creativity',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    title: 'Bytewave Technology',
    statusBarStyle: 'default',
    startupImage: [
      '/logo.png'
    ]
  }
}
export default function RootLayout({ children }) {
  return (
        <AuthProvider>
          <ServiceProvider>
            <TrainingProvider >
              <Navbar/>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </TrainingProvider>
          </ServiceProvider>
        </AuthProvider>
  );
}