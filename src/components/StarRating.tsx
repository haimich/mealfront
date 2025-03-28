
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  rating?: number; // Add rating prop
  onChange?: (rating: number) => void;
  onRate?: (rating: number) => void; // Add onRate prop
  readOnly?: boolean;
  editable?: boolean; // Add editable prop
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  initialRating = 0, 
  rating, // Use rating if provided
  onChange, 
  onRate, // Support onRate callback
  readOnly = false,
  editable, // Support editable
  size = 20
}) => {
  // Use rating prop if provided, otherwise use initialRating
  const [internalRating, setInternalRating] = useState(rating ?? initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  // Determine if the component is in readonly mode
  const isReadOnly = readOnly || (editable === false);

  const handleClick = (index: number) => {
    if (isReadOnly) return;
    
    const newRating = index;
    setInternalRating(newRating);
    onChange?.(newRating);
    onRate?.(newRating); // Call onRate if provided
  };

  // The actual rating to display - use external rating if provided
  const displayRating = rating ?? internalRating;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => {
        const isActive = (hoverRating || displayRating) >= index;
        
        return (
          <button
            key={index}
            type="button"
            className={`text-yellow-400 transition-transform duration-150 ${
              isActive ? 'scale-110' : 'text-gray-300'
            } ${!isReadOnly && 'hover:scale-110'}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !isReadOnly && setHoverRating(index)}
            onMouseLeave={() => !isReadOnly && setHoverRating(0)}
            disabled={isReadOnly}
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
