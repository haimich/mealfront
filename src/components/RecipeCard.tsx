
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import type { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  // Format the duration to a human-readable format
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${remainingMinutes} min`;
  };

  // Format the date to a relative time (e.g., "2 days ago")
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <article className="recipe-card glass group overflow-hidden">
      <Link to={`/recipe/${recipe.id}`} className="block h-full">
        <div className="aspect-[4/3] overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs text-muted-foreground">
                {formatDate(recipe.createdAt)}
              </span>
              <h3 className="text-lg font-medium mt-1">{recipe.title}</h3>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock size={16} className="mr-1" />
              <span className="text-sm">{formatDuration(recipe.duration)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <StarRating initialRating={recipe.rating} readOnly size={16} />
            <ChevronRight size={20} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default RecipeCard;
