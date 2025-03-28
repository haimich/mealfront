
import { createClient } from '@supabase/supabase-js';
import { Recipe } from '@/types/recipe';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the supabase client from the generated file
export const supabase = supabaseClient;

// Type for the database recipe (how it's stored in Supabase)
export interface DbRecipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  notes?: string;
  duration: number;
  rating?: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
  source?: string;
  user_id: string;
  original_ingredients?: string[];
}

// Convert from DB format to app format
export const mapDbRecipeToRecipe = (dbRecipe: DbRecipe): Recipe => ({
  id: dbRecipe.id,
  title: dbRecipe.title,
  ingredients: dbRecipe.ingredients,
  instructions: dbRecipe.instructions,
  notes: dbRecipe.notes,
  duration: dbRecipe.duration,
  rating: dbRecipe.rating,
  createdAt: new Date(dbRecipe.created_at),
  updatedAt: new Date(dbRecipe.updated_at),
  imageUrl: dbRecipe.image_url,
  source: dbRecipe.source,
  userId: dbRecipe.user_id,
  originalIngredients: dbRecipe.original_ingredients,
});

// Convert from app format to DB format
export const mapRecipeToDbRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Omit<DbRecipe, 'id' | 'created_at' | 'updated_at'> => ({
  title: recipe.title,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  notes: recipe.notes,
  duration: recipe.duration,
  rating: recipe.rating,
  image_url: recipe.imageUrl,
  source: recipe.source,
  user_id: userId,
  original_ingredients: recipe.originalIngredients,
});
