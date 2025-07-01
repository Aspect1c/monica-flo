import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { RatingValue } from '../types';

interface RatingSelectorProps {
  id: string;
  name: string;
  value: RatingValue | null;
  onChange: (value: RatingValue) => void;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ id, name, value, onChange }) => {
  const ratings: { label: string; value: RatingValue; icon: JSX.Element; color: string }[] = [
    { 
      label: 'Чудово', 
      value: 'good', 
      icon: <CheckCircle2 className="w-5 h-5" />, 
      color: 'text-green-500 border-green-500'
    },
    { 
      label: 'Посереднє', 
      value: 'partial', 
      icon: <AlertTriangle className="w-5 h-5" />, 
      color: 'text-yellow-500 border-yellow-500'
    },
    { 
      label: 'Погано', 
      value: 'bad', 
      icon: <XCircle className="w-5 h-5" />, 
      color: 'text-red-500 border-red-500'
    }
  ];

  return (
    <div className="flex space-x-2">
      {ratings.map((rating) => (
        <label 
          key={`${id}-${rating.value}`}
          className={`
            flex items-center justify-center p-2 rounded-md cursor-pointer
            transition-all duration-200 border
            ${value === rating.value 
              ? `bg-${rating.value === 'good' ? 'green' : rating.value === 'partial' ? 'amber' : 'red'}-100 dark:bg-${rating.value === 'good' ? 'green' : rating.value === 'partial' ? 'amber' : 'red'}-900/20 ${rating.color}`
              : 'bg-gray-100 dark:bg-gray-800 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
            }
            flex-1 text-center
          `}
        >
          <input
            type="radio"
            name={name}
            id={`${id}-${rating.value}`}
            value={rating.value}
            checked={value === rating.value}
            onChange={() => onChange(rating.value)}
            className="sr-only"
          />
          <div className="flex flex-col items-center sm:flex-row sm:space-x-1">
            <span className={value === rating.value ? rating.color : 'text-gray-600 dark:text-gray-400'}>
              {rating.icon}
            </span>
            <span className={`text-xs ${value === rating.value ? 'font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
              {rating.label}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default RatingSelector;