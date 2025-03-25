
import { toast } from 'sonner';
import { supabase, mapDbRecipeToRecipe, mapRecipeToDbRecipe } from '@/lib/supabase';
import { Recipe } from '@/types/recipe';
import { demoRecipes } from '@/data/demoRecipes';

export const fetchRecipes = async (): Promise<{
  recipes: Recipe[],
  error: string | null
}> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.warn('Supabase configuration is missing. Using demo recipes.');
      return { recipes: demoRecipes, error: null };
    }
    
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Map database recipes to app format
      const mappedRecipes = data.map(mapDbRecipeToRecipe);
      return { recipes: mappedRecipes, error: null };
    } else {
      // If no recipes are found, use demo recipes as fallback
      console.info('No recipes found in database. Using demo recipes.');
      return { recipes: demoRecipes, error: null };
    }
  } catch (err) {
    console.error('Error fetching recipes:', err);
    // Use demo recipes as fallback
    toast.error('Failed to load recipes. Using demo data instead.');
    return { recipes: demoRecipes, error: 'Failed to load recipes' };
  }
};

export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  try {
    // If Supabase is not available, just add to local state
    if (!supabase) {
      const newRecipe: Recipe = {
        ...recipe,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      toast.success('Recipe created successfully (local only)');
      return newRecipe;
    }
    
    const dbRecipe = mapRecipeToDbRecipe(recipe);
    
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
  } catch (err) {
    console.error('Error adding recipe:', err);
    toast.error('Failed to create recipe');
    throw err;
  }
};

export const updateRecipe = async (id: string, updatedFields: Partial<Recipe>): Promise<void> => {
  try {
    // If Supabase is not available, just return success
    if (!supabase) {
      toast.success('Recipe updated successfully (local only)');
      return;
    }
    
    // Convert fields for Supabase
    const dbFields: any = { ...updatedFields };
    
    if (updatedFields.imageUrl !== undefined) {
      dbFields.image_url = updatedFields.imageUrl;
      delete dbFields.imageUrl;
    }

    const { error } = await supabase
      .from('recipes')
      .update({ ...dbFields, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    toast.success('Recipe updated successfully');
  } catch (err) {
    console.error('Error updating recipe:', err);
    toast.error('Failed to update recipe');
    throw err;
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    // If Supabase is not available, just return success
    if (!supabase) {
      toast.success('Recipe deleted successfully (local only)');
      return;
    }
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Recipe deleted successfully');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    toast.error('Failed to delete recipe');
    throw err;
  }
};
