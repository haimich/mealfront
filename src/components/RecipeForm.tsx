import React, { useState } from 'react';
import { X, Plus, Clock, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import type { Recipe } from '@/types/recipe';

interface RecipeFormProps {
  initialData?: Recipe;
  mode: 'create' | 'edit';
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, mode }) => {
  const navigate = useNavigate();
  const { addRecipe, updateRecipe } = useRecipes();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || ['']);
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [duration, setDuration] = useState(initialData?.duration || 30);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [source, setSource] = useState(initialData?.source || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) {
      setIngredients(['']);
      return;
    }
    
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (ingredients.some((ingredient) => !ingredient.trim())) {
      newErrors.ingredients = 'All ingredients must be filled';
    }
    
    if (!instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    if (duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    // Validate URL format if source is provided
    if (source && !isValidUrl(source)) {
      newErrors.source = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate URL format
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const recipeData = {
      title,
      ingredients: ingredients.filter((ingredient) => ingredient.trim() !== ''),
      instructions,
      notes: notes || undefined,
      duration,
      imageUrl: imageUrl || undefined,
      source: source || undefined,
      rating: initialData?.rating,
    };
    
    if (mode === 'create') {
      addRecipe(recipeData);
      navigate('/');
    } else if (initialData) {
      updateRecipe(initialData.id, recipeData);
      navigate(`/recipe/${initialData.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Recipe Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
          placeholder="e.g., Classic Pancakes"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Ingredients</label>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                placeholder="e.g., 1 cup all-purpose flour"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
        {errors.ingredients && <p className="text-sm text-destructive">{errors.ingredients}</p>}
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus size={16} />
          <span>Add Ingredient</span>
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="instructions" className="block text-sm font-medium">
          Instructions
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={6}
          className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
          placeholder="Step-by-step instructions for preparing the recipe..."
        />
        {errors.instructions && <p className="text-sm text-destructive">{errors.instructions}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
          placeholder="Any additional tips or notes about the recipe..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="duration" className="block text-sm font-medium flex items-center gap-2">
            <Clock size={16} />
            <span>Duration (minutes)</span>
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
          />
          {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            Image URL (Optional)
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="source" className="block text-sm font-medium flex items-center gap-2">
          <Link size={16} />
          <span>Recipe Source (Optional)</span>
        </label>
        <input
          id="source"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/50 border border-border focus:ring-2 focus:ring-accent focus:outline-none transition-all"
          placeholder="https://example.com/recipe"
        />
        {errors.source && <p className="text-sm text-destructive">{errors.source}</p>}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => navigate(initialData ? `/recipe/${initialData.id}` : '/')}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {mode === 'create' ? 'Create Recipe' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
