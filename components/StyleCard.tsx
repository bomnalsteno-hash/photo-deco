import React from 'react';
import { StyleConfig } from '../types';
import * as Icons from 'lucide-react';

interface StyleCardProps {
  styleConfig: StyleConfig;
  isSelected: boolean;
  onClick: () => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ styleConfig, isSelected, onClick }) => {
  const IconComponent = (Icons as any)[styleConfig.icon];

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-start p-4 rounded-3xl transition-all duration-300 w-full text-left border-2
        ${isSelected 
          ? `${styleConfig.color} shadow-lg scale-[1.02] -rotate-1` 
          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]'
        }
      `}
    >
      <div className={`
        p-2.5 rounded-2xl mb-3 transition-colors
        ${isSelected ? 'bg-white bg-opacity-60 backdrop-blur-sm' : 'bg-slate-100 text-slate-400'}
      `}>
        {IconComponent && <IconComponent size={24} strokeWidth={2.5} />}
      </div>
      
      <h3 className="font-bold text-lg mb-1">
        {styleConfig.name}
      </h3>
      
      <p className={`text-sm leading-relaxed font-medium ${isSelected ? 'opacity-90' : 'text-slate-400'}`}>
        {styleConfig.description}
      </p>

      {/* Cute Selection Sticker */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md border-2 border-current">
          <Icons.Heart size={16} fill="currentColor" />
        </div>
      )}
    </button>
  );
};

export default StyleCard;