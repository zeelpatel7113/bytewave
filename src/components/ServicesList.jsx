import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ServicesList({ services }) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState(null);

  const handleMouseMove = (e) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const activeServiceData = services.find(service => service.title === activeService);

  return (
    <div 
      className="min-h-screen bg-white px-4 py-16 md:px-8 relative" 
      onMouseMove={handleMouseMove}
      style={{ cursor: activeService ? 'none' : 'auto' }}
    >
      <div className="max-w-7xl mx-auto relative">
        {services.map((service) => (
          <div
            key={service.number}
            className="border-t border-gray-100 py-8 group"
            onMouseEnter={() => setActiveService(service.title)}
            onMouseLeave={() => setActiveService(null)}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-medium text-black transition-opacity duration-300 group-hover:opacity-70">
                  {service.title}
                </h2>
                <p className={`text-gray-600 text-sm max-w-2xl transition-opacity duration-300 ${
                  activeService === service.title ? 'opacity-100' : 'opacity-0'
                }`}>
                  {service.description}
                </p>
              </div>
              <span className="text-sm text-purple-600 font-light">{service.number}</span>
            </div>
          </div>
        ))}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <a
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-purple-600 transition-colors"
          >
            View All Services
            <ArrowUpRight size={18} />
          </a>
        </div>

        {activeServiceData && (
          <div
            className="fixed pointer-events-none"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              position: 'fixed',
            }}
          >
            <div className="w-[200px] h-[200px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={activeServiceData.image} 
                alt={activeServiceData.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}