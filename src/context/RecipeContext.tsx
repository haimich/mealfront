
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Recipe, RecipeContextType } from '@/types/recipe';
import * as recipeService from '@/services/recipeService';

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      const result = await recipeService.fetchRecipes();
      setRecipes(result.recipes);
      setError(result.error);
      setLoading(false);
    };

    loadRecipes();
  }, []);

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe = await recipeService.addRecipe(recipe);
    setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
  };

  const updateRecipe = async (id: string, updatedFields: Partial<Recipe>) => {
    await recipeService.updateRecipe(id, updatedFields);
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === id
          ? { ...recipe, ...updatedFields, updatedAt: new Date() }
          : recipe
      )
    );
  };

  const deleteRecipe = async (id: string) => {
    await recipeService.deleteRecipe(id);
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
  };

  const getRecipe = (id: string) => {
    return recipes.find((recipe) => recipe.id === id);
  };

  const rateRecipe = async (id: string, rating: number) => {
    await updateRecipe(id, { rating });
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        rateRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
