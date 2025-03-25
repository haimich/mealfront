
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';
import RecipeCard from '@/components/RecipeCard';
import { useRecipes } from '@/context/RecipeContext';

const Dashboard: React.FC = () => {
  const { recipes } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some((ingredient) => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Layout>
      <div className="mb-12">
        <div className="relative max-w-lg mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search recipes by title or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-10 pr-4 bg-white/50 border border-border rounded-full focus:ring-2 focus:ring-accent focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-medium mb-6">Your Recipes</h2>
            {filteredRecipes.length > 0 ? (
              <div className="layout-grid">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No recipes found for "{searchTerm}".
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No recipes yet. Create your first recipe.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
