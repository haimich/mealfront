
// Recipe related type definitions
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  originalIngredients?: string[]; // Store the original ingredients for scaling
  instructions: string;
  notes?: string;
  duration: number; // in minutes
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  source?: string; // URL source for the recipe
  userId?: string; // ID of the user who created the recipe
}

export interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  getRecipe: (id: string) => Recipe | undefined;
  rateRecipe: (id: string, rating: number) => Promise<void>;
}
