import React, { useEffect } from 'react';
import { PieChart, Star, Sparkles, ArrowUpRight } from 'lucide-react';

function Hero() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden pt-12 ">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .slide-in-left {
          transform: translateX(-100px);
        }
        .slide-in-right {
          transform: translateX(100px);
        }
        .fade-in-up {
          transform: translateY(20px);
        }
        .scale-in {
          transform: scale(0.8);
        }
      `}</style>

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-32 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-purple-100 rounded-full blur-3xl opacity-0 animate-on-scroll scale-in transition-all duration-1000 delay-300"></div>
          <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100 rounded-full blur-3xl opacity-0 animate-on-scroll scale-in transition-all duration-1000 delay-500"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20 relative">
          {/* Text Content */}
          <div className="w-full lg:w-[60%] space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 rounded-full mb-4 sm:mb-6 opacity-0 animate-on-scroll slide-in-left transition-all duration-700 border-1 border-purple-800">
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-500 " />
              <span className="text-xs sm:text-sm font-medium text-zinc-950">Innovating B2B Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight opacity-0 animate-on-scroll slide-in-left transition-all duration-700 delay-200">
              An independent B2B media company operating across digital, print and live events.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto lg:mx-0 opacity-0 animate-on-scroll slide-in-left transition-all duration-700 delay-400">
              Our quality is the strength of our brands. Whether it's a publication, award ceremony or a conference, our brands are strong leading industry names, at the axis of key debates.
            </p>
          </div>

          {/* Grid Content */}
          <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[40%] relative mt-8 lg:mt-0">
            <div className="relative max-w-[500px] mx-auto grid grid-cols-6 gap-2 sm:gap-4 p-2 sm:p-4">
              {/* Laptop Image */}
              <div className="col-span-4 row-span-3 bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 opacity-0 animate-on-scroll slide-in-right transition-all duration-700 delay-300">
                <img
                  src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=300&h=300"
                  alt="Person working on laptop"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Stats Card */}
              <div className="col-span-2 col-start-5 row-span-2 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-on-scroll slide-in-right transition-all duration-700 delay-500 group">
                <div className="bg-black rounded-full w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <PieChart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#c3ff53]" />
                </div>
                <div className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-1 text-zinc-950">
                  +25.5%
                  <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                </div>
                <div className="text-sm font-semibold mb-1 text-zinc-900">Company efficiency</div>
                <div className="text-[10px] sm:text-xs text-zinc-800">(+2.8%) Month</div>
              </div>

              {/* Rating Card */}
              <div className="col-span-2 col-start-5 row-start-3 bg-black rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg hover:-translate-y-1 transition-transform duration-300 opacity-0 animate-on-scroll slide-in-right transition-all duration-700 delay-700">
                <div className="flex items-center gap-1.5">
                  <div className="text-lg sm:text-xl font-bold text-[#c3ff53]">9.8</div>
                  <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#c3ff53] fill-current animate-pulse" />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Overall clients rate</div>
                <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5">More than 10K reviews</div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-6 sm:w-8 h-6 sm:h-8 bg-purple-100 rounded-full opacity-0 animate-on-scroll scale-in transition-all duration-700 delay-900"></div>
            <div className="absolute -bottom-4 -right-4 w-6 sm:w-8 h-6 sm:h-8 bg-blue-100 rounded-full opacity-0 animate-on-scroll scale-in transition-all duration-700 delay-1000"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;