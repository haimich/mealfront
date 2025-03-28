import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IngredientScalerProps {
  scale?: number;
  onScaleChange?: (scale: number) => void;
  originalIngredients?: string[];
  ingredients?: string[];
  setIngredients?: (ingredients: string[]) => void;
  readOnly?: boolean;
}

const scaleOptions = [0.5, 1, 2, 4];

const IngredientScaler: React.FC<IngredientScalerProps> = ({ 
  scale = 1, 
  onScaleChange,
  originalIngredients = [],
  ingredients = [],
  setIngredients = () => {},
  readOnly = false
}) => {
  const [currentScale, setCurrentScale] = useState(scale);

  useEffect(() => {
    if (originalIngredients && originalIngredients.length > 0 && setIngredients && !readOnly) {
      const scaledIngredients = scaleIngredients(originalIngredients, currentScale);
      setIngredients(scaledIngredients);
    }
  }, [currentScale, originalIngredients, setIngredients, readOnly]);

  const handleScaleChange = (newScale: number) => {
    setCurrentScale(newScale);
    onScaleChange?.(newScale);
  };

  const scaleIngredients = (ingredientList: string[], scaleFactor: number): string[] => {
    return ingredientList.map(ingredient => {
      const match = ingredient.match(/^([\d\/.]+)\s/);
      if (match) {
        const originalAmount = match[1];
        let numericAmount: number;
        
        if (originalAmount.includes('/')) {
          const [numerator, denominator] = originalAmount.split('/').map(Number);
          numericAmount = numerator / denominator;
        } else {
          numericAmount = parseFloat(originalAmount);
        }
        
        const scaledAmount = numericAmount * scaleFactor;
        
        let formattedAmount: string;
        if (scaledAmount === 0.5) {
          formattedAmount = "1/2";
        } else if (scaledAmount === 0.25) {
          formattedAmount = "1/4";
        } else if (scaledAmount === 0.75) {
          formattedAmount = "3/4";
        } else if (Number.isInteger(scaledAmount)) {
          formattedAmount = scaledAmount.toString();
        } else {
          formattedAmount = scaledAmount.toFixed(1).replace('.0', '');
        }
        
        return ingredient.replace(originalAmount, formattedAmount);
      }
      return ingredient;
    });
  };

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
              currentScale === option ? "bg-primary text-primary-foreground" : "bg-background"
            )}
            onClick={() => handleScaleChange(option)}
            disabled={readOnly}
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
