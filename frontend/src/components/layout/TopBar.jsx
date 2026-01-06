
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-start items-center px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
      <h1 
        onClick={() => navigate('/match')}
        className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
      >
        Aviato
      </h1>
    </div>
  );
};

export default TopBar;
