
import { toast } from 'sonner';
import { supabase, mapDbRecipeToRecipe, mapRecipeToDbRecipe } from '@/lib/supabase';
import { Recipe } from '@/types/recipe';
import { demoRecipes } from '@/data/demoRecipes';

export const fetchRecipes = async (userId?: string): Promise<{
  recipes: Recipe[],
  error: string | null
}> => {
  try {
    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If userId is provided, filter by user_id
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Map database recipes to app format
      const mappedRecipes = data.map(mapDbRecipeToRecipe);
      return { recipes: mappedRecipes, error: null };
    } else {
      // If no recipes are found, use demo recipes as fallback if no user is logged in
      if (!userId) {
        console.info('No recipes found in database. Using demo recipes.');
        return { recipes: demoRecipes, error: null };
      }
      // For logged in users with no recipes, return empty array
      return { recipes: [], error: null };
    }
  } catch (err: any) {
    console.error('Error fetching recipes:', err);
    toast.error('Failed to load recipes. Using demo data instead.');
    return { recipes: userId ? [] : demoRecipes, error: 'Failed to load recipes' };
  }
};

export const addRecipe = async (
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>, 
  userId: string
): Promise<Recipe> => {
  try {
    const dbRecipe = mapRecipeToDbRecipe(recipe, userId);
    
    const { data, error } = await supabase
      .from('recipes')
      .insert(dbRecipe)
      .select()
      .single();

    if (error) throw error;

    if (data) {
      const newRecipe = mapDbRecipeToRecipe(data);
      toast.success('Recipe created successfully');
      return newRecipe;
    }
    
    throw new Error('Failed to create recipe');
  } catch (err: any) {
    console.error('Error adding recipe:', err);
    toast.error('Failed to create recipe');
    throw err;
  }
};

export const updateRecipe = async (id: string, updatedFields: Partial<Recipe>, userId: string): Promise<void> => {
  try {
    // Convert fields for Supabase
    const dbFields: any = { ...updatedFields };
    
    if (updatedFields.imageUrl !== undefined) {
      dbFields.image_url = updatedFields.imageUrl;
      delete dbFields.imageUrl;
    }

    const { error } = await supabase
      .from('recipes')
      .update({ ...dbFields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    toast.success('Recipe updated successfully');
  } catch (err: any) {
    console.error('Error updating recipe:', err);
    toast.error('Failed to update recipe');
    throw err;
  }
};

export const deleteRecipe = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    toast.success('Recipe deleted successfully');
  } catch (err: any) {
    console.error('Error deleting recipe:', err);
    toast.error('Failed to delete recipe');
    throw err;
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      return mapDbRecipeToRecipe(data);
    }
    
    return null;
  } catch (err: any) {
    console.error('Error fetching recipe:', err);
    toast.error('Failed to fetch recipe');
    return null;
  }
};
