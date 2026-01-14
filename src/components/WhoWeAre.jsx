import React from 'react';
import { BookOpen, Target, Code, Heart } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

function WhoWeAre() {
  const [headerRef, headerVisible] = useInView({ threshold: 0.1 });
  const [cardsRef, cardsVisible] = useInView({ threshold: 0.1 });
  
  const cards = [
    {
      icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />,
      title: "Our Story",
      content: "Connecting talent with opportunities that matter."
    },
    {
      icon: <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />,
      title: "Mission & Vision",
      content: "Fueling business success and career growth through people-first solutions."
    },
    {
      icon: <Code className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />,
      title: "Our Expertise",
      content: "Where skilled professionals meet the right opportunities."
    },
    {
      icon: <Heart className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />,
      title: "Customer-Centric",
      content: "A trusted partner in every growth journey."
    }
  ];
  
  return (
    <div className="py-12 md:py-16 lg:py-20 px-4 md:px-8">
      <div 
        ref={headerRef} 
        className={`text-center mb-10 md:mb-16 transition-all duration-700 transform ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Who We <span className="text-blue-500">Are</span></h2>
      </div>
      
      <div 
        ref={cardsRef} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`bg-white shadow-lg rounded-lg p-4 md:p-6 transition-all duration-700 transform delay-${index * 100} ${
              cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">{card.title}</h3>
            <p className="text-gray-600 text-sm md:text-base">{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhoWeAre;