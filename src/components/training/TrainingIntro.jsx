import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function TrainingIntro() {
  const descriptionText =
    "Our expert-led programs combine industry knowledge with practical preparation,equipping you with the skills to excel in today’s hiring market. From resume building and interview mastery to technical upskilling, we deliver actionable training that ensures real-world career success.";
  const words = descriptionText.split(" ");
  const { scrollYProgress } = useScroll();
  const [wordOpacities, setWordOpacities] = useState(
    Array(words.length).fill(0.2)
  );

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(".animated-text");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isInView) {
        const words = element.querySelectorAll(".word");
        words.forEach((word, index) => {
          setTimeout(() => {
            word.style.opacity = "1";
            word.style.transform = "translateY(0)";
          }, index * 50);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateOpacities = () => {
      const progress = scrollYProgress.get();
      const newOpacities = words.map((_, index) => {
        const wordProgress = progress + index * 0.015;
        return Math.max(0.2, Math.min(1, wordProgress * 3));
      });
      setWordOpacities(newOpacities);
    };

    const unsubscribe = scrollYProgress.on("change", updateOpacities);
    return () => unsubscribe();
  }, [words.length, scrollYProgress]);

  return (
    <motion.div
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto mt-24">
        <div className="flex flex-col md:flex-row">
          <motion.div
            className="md:w-1/3 mb-8 md:mb-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-blue-500 text-2xl font-semibold">
              / Training
            </span>
          </motion.div>

          <div className="md:w-2/3">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold leading-tight mb-16 text-zinc-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Master Job-Ready Skills. Secure Your Future.
            </motion.h2>

            <div className="text-xl leading-relaxed animated-text text-zinc-900">
              {words.map((word, index) => (
                <motion.span
                  key={`word-${index}`}
                  className="word inline-block mr-[0.3em] opacity-0"
                  style={{
                    transform: "translateY(20px)",
                    transition: `opacity 0.5s ease, transform 0.5s ease`,
                    transitionDelay: `${index * 0.01}s`,
                    opacity: wordOpacities[index],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}