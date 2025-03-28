
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IngredientScalerProps {
  scale: number;
  onScaleChange: (scale: number) => void;
}

const scaleOptions = [0.5, 1, 2, 4];

const IngredientScaler: React.FC<IngredientScalerProps> = ({ scale, onScaleChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium mr-2">Adjust servings:</span>
      <div className="flex gap-1">
        {scaleOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant="outline"
            className={cn(
              "min-w-10 px-2 py-1",
              scale === option ? "bg-primary text-primary-foreground" : "bg-background"
            )}
            onClick={() => onScaleChange(option)}
          >
            {option === 0.5 ? "½" : option}
            {option === 1 ? "×" : option > 1 ? "×" : ""}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default IngredientScaler;
