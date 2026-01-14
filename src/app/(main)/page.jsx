"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ServicesList from "@/components/ServicesList";
import { homeContent } from "@/content/home";
import Hero from "@/components/hero";
import ProcessSection from "@/components/ProcessSection";
import { Stats } from "@/components/Stats";
import About from "../../components/about";
import Testimonials from "@/components/Testimonials";
// import WhatsAppChatButton from "@/components/WaButton";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Stats />
      {/* <section className="py-20 bg-gray-50">
        <motion.div 
          className="container mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-zinc-900">
            {homeContent.solutions.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {homeContent.solutions.cards.map((card, index) => (
              <motion.div
                key={card.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-zinc-900">{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <Link 
                  href={card.link}
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  Learn more →
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section> */}

      <ServicesList services={homeContent.services} />
      <ProcessSection />
      <About />
      <Testimonials />


{/* contact section of dashboard*/}


      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6">{homeContent.cta.title}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {homeContent.cta.description}
          </p>
          <Link href={homeContent.cta.button.link}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold flex items-center mx-auto space-x-2 hover:bg-gray-50 transition-colors"
            >
              <span>{homeContent.cta.button.text}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
      {/* <div className="fixed right-8">
        <WhatsAppChatButton
          phone="918200662782"
          message="Hi! I have a question about your product."
          size={64}
          showPopup={true}
        />
      </div> */}
    </div>
  );
}
