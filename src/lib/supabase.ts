
import { createClient } from '@supabase/supabase-js';
import { Recipe } from '@/types/recipe';

// Supabase URLs and keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
});
