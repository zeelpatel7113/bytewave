import React, { useState } from "react";

const Blogbar = ({ onSearch, onFilter }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", "Career", "News", "Events", "Training"];

  const handleFilterClick = (category) => {
    setActiveFilter(category);
    onFilter(category);
  };

  return (
    <div className="mx-auto relative top-14 w-11/12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Category Filters */}
        <ul className="flex flex-wrap justify-center md:justify-start gap-6 text-lg font-medium">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`cursor-pointer transition-all duration-300 ${
                activeFilter === cat
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>

        {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search blogs..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full h-11 pl-4 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base transition-all"
            />
          </div>
      </div>

      {/* Divider */}
      <div className="mt-6 h-0.5 bg-gray-200 rounded-full"></div>
    </div>
  );
};

export default Blogbar;
