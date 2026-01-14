import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import ServiceProvider from "@/providers/ServiceProvider";
import { TrainingProvider } from "@/providers/TrainingProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";
import WhatsAppChatButton from "@/components/WhatsappButton";
const inter = Inter({ subsets: ["latin"] });
import ScheduleMeetingButton from "@/components/Schedule_meeting"

export const metadata = {
  title: "Bytewave Technology",
  description: "Building workforce excellence through innovation and expertise",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    title: "Bytewave Technology",
    statusBarStyle: "default",
    startupImage: ["/logo.png"],
  },
};
export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <ServiceProvider>
        <TrainingProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
            <div className="fixed right-8">
              <WhatsAppChatButton
                phone="+13127888738"
                message="Hi! I have a question about your product."
                size={50}
                showPopup={true}
              />
            </div>
           < ScheduleMeetingButton
           size= {50}
           />
          </main>
          <Footer />
        </TrainingProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}
