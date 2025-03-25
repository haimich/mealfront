
import { Recipe } from '../types/recipe';

// Demo recipes for when Supabase is not configured or as fallback
export const demoRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Pancakes',
    ingredients: [
      '1 cup all-purpose flour',
      '2 tablespoons sugar',
      '2 teaspoons baking powder',
      '1/2 teaspoon salt',
      '1 cup milk',
      '2 tablespoons melted butter',
      '1 large egg',
    ],
    instructions: 'In a bowl, whisk together the flour, sugar, baking powder, and salt. In another bowl, beat the egg, then add milk and melted butter. Combine wet and dry ingredients, stirring just until moistened (batter will be lumpy). Heat a lightly oiled griddle over medium-high heat. Pour batter onto the griddle, about 1/4 cup for each pancake. Cook until bubbles form and edges are dry, then flip and cook until browned on the other side.',
    notes: 'For extra fluffy pancakes, let the batter rest for 5 minutes before cooking.',
    duration: 20,
    rating: 4.5,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    imageUrl: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    source: 'https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/'
  },
  {
    id: '2',
    title: 'Avocado Toast',
    ingredients: [
      '1 slice whole grain bread',
      '1/2 ripe avocado',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      'Lemon juice (optional)',
    ],
    instructions: 'Toast the bread to your desired level of crispness. Mash the avocado in a small bowl with a fork. Spread the mashed avocado on top of the toast. Season with salt, pepper, and optional red pepper flakes or a squeeze of lemon juice.',
    duration: 5,
    rating: 5,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    source: 'https://cookieandkate.com/avocado-toast-recipe/'
  },
  {
    id: '3',
    title: 'Caprese Salad',
    ingredients: [
      '3 large ripe tomatoes',
      '8 oz fresh mozzarella cheese',
      'Fresh basil leaves',
      '2 tablespoons extra virgin olive oil',
      '1 tablespoon balsamic glaze',
      'Salt and freshly ground black pepper',
    ],
    instructions: 'Slice the tomatoes and mozzarella into 1/4-inch thick slices. Arrange them on a platter, alternating the tomato, mozzarella, and basil leaves. Drizzle with olive oil and balsamic glaze. Season with salt and pepper to taste.',
    notes: 'For best flavor, use room temperature tomatoes and cheese.',
    duration: 10,
    rating: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    source: 'https://www.simplyrecipes.com/recipes/caprese_salad/'
  },
];
