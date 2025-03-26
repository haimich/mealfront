
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Pencil, Trash2, ArrowLeft, Check, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import { useRecipes } from '@/context/RecipeContext';
import { useAuth } from '@/context/AuthContext';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe, deleteRecipe, rateRecipe } = useRecipes();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { user } = useAuth();

  const recipe = getRecipe(id || '');

  if (!recipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Recipe not found.</p>
          <Link to="/" className="btn-primary">Go back to Dashboard</Link>
        </div>
      </Layout>
    );
  }

  // Format the duration to a human-readable format
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteRecipe(recipe.id);
      navigate('/');
    } else {
      setConfirmDelete(true);
      
      // Reset confirmation after 3 seconds
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
  };

  const handleRating = (rating: number) => {
    rateRecipe(recipe.id, rating);
  };

  return (
    <Layout>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Recipes</span>
          </Link>
          
          <div className="flex gap-2">
            {user && (
              <>
                <Link 
                  to={`/edit/${recipe.id}`} 
                  className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Pencil size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className={`p-2 rounded-full transition-colors ${
                    confirmDelete 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {confirmDelete ? <Check size={20} /> : <Trash2 size={20} />}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden mb-8">
          {recipe.imageUrl && (
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-medium mb-2">{recipe.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center text-muted-foreground">
                <Clock size={18} className="mr-2" />
                <span>{formatDuration(recipe.duration)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <StarRating
                  initialRating={recipe.rating}
                  onChange={handleRating}
                />
                {recipe.rating && (
                  <span className="text-sm text-muted-foreground">
                    {recipe.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            
            {recipe.source && (
              <div className="mb-6">
                <a 
                  href={recipe.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  <ExternalLink size={16} className="mr-2" aria-hidden="true" />
                  <span>Original recipe source</span>
                </a>
              </div>
            )}
            
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-medium mb-4">Ingredients</h2>
                <ul className="space-y-2 pl-5">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="list-disc">{ingredient}</li>
                  ))}
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-medium mb-4">Instructions</h2>
                <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                  {recipe.instructions}
                </div>
              </section>
              
              {recipe.notes && (
                <section className="bg-secondary p-6 rounded-xl">
                  <h2 className="text-xl font-medium mb-2">Notes</h2>
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                    {recipe.notes}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-8">
          <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
          {recipe.updatedAt !== recipe.createdAt && (
            <p>Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetail;
