
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  initialRating = 0, 
  onChange, 
  readOnly = false,
  size = 20
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (readOnly) return;
    
    const newRating = index;
    setRating(newRating);
    onChange?.(newRating);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => {
        const isActive = (hoverRating || rating) >= index;
        
        return (
          <button
            key={index}
            type="button"
            className={`text-yellow-400 transition-transform duration-150 ${
              isActive ? 'scale-110' : 'text-gray-300'
            } ${!readOnly && 'hover:scale-110'}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHoverRating(index)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
          >
            <Star
              size={size}
              fill={isActive ? 'currentColor' : 'none'}
              className={isActive ? 'animate-scale-in' : ''}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
