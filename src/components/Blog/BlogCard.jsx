import React, { useState } from "react";

const BlogCard = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Safety check for data
  if (!data) {
    return null;
  }

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card container */}
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
        
        <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden">
          
          {/* Image section - Fixed height */}
          <div className="relative w-full md:w-2/5 h-64 md:h-80 overflow-hidden group flex-shrink-0">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/30 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <p className="text-xs uppercase text-blue-600 font-bold tracking-wider">
                {data.category}
              </p>
            </div>
          </div>

          {/* Content section */}
          <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
            
            <div className="flex-1">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight hover:text-blue-600 transition-colors duration-300">
                {data.title}
              </h2>
              
              {/* Subtitle */}
              {data.subtitle && (
                <p className="text-blue-600 font-semibold mb-3 text-base">{data.subtitle}</p>
              )}
              
              {/* Animated line */}
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-4 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-1000 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}></div>
              </div>
              
              {/* Description */}
               <div
                    className="text-sm text-gray-700 mb-4 line-clamp-3 flex-1"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />
              
              {/* Read more link */}
              <a 
                href={`/blog/${data._id}` }
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors relative group/link"
              >
                <span className="relative">
                  Read Full Article
                  {/* Animated underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover/link:w-full transition-all duration-300"></span>
                </span>
                <svg 
                  className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Author section */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {data.author.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Author</p>
                <p className="text-sm font-bold text-gray-800">{data.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;