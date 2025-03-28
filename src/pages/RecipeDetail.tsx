import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Pencil, Trash2, ArrowLeft, Check, ExternalLink, User } from 'lucide-react';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import IngredientScaler from '@/components/IngredientScaler';
import { useRecipes } from '@/context/RecipeContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe, deleteRecipe, rateRecipe } = useRecipes();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { user } = useAuth();
  const [creator, setCreator] = useState<{ username: string; fullName: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1);

  const recipe = getRecipe(id || '');

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if (!recipe?.userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', recipe.userId)
          .single();
        
        if (error) {
          console.error('Error fetching creator profile:', error);
          return;
        }
        
        if (data) {
          setCreator({
            username: data.username,
            fullName: data.full_name
          });
        }
      } catch (error) {
        console.error('Error fetching creator profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorProfile();
  }, [recipe]);

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
      
      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
    }
  };

  const handleRating = (rating: number) => {
    rateRecipe(recipe.id, rating);
  };

  const scaleIngredient = (ingredient: string): string => {
    if (!recipe?.originalIngredients) return ingredient;
    
    const regex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)(\s+)/;
    
    const match = ingredient.match(regex);
    
    if (!match) return ingredient;
    
    const quantity = match[1];
    let scaledQuantity: number | string;
    
    if (quantity.includes('/')) {
      const parts = quantity.split('/');
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        scaledQuantity = (numerator / denominator) * scale;
      } else {
        const mixedParts = quantity.split(' ');
        const whole = parseFloat(mixedParts[0]);
        const fractionParts = mixedParts[1].split('/');
        const numerator = parseFloat(fractionParts[0]);
        const denominator = parseFloat(fractionParts[1]);
        scaledQuantity = (whole + numerator / denominator) * scale;
      }
    } else {
      scaledQuantity = parseFloat(quantity) * scale;
    }

    if (Number.isInteger(scaledQuantity)) {
      scaledQuantity = scaledQuantity.toString();
    } else {
      if (scaledQuantity === 0.5) scaledQuantity = "1/2";
      else if (scaledQuantity === 0.25) scaledQuantity = "1/4";
      else if (scaledQuantity === 0.75) scaledQuantity = "3/4";
      else if (scaledQuantity === 0.33 || scaledQuantity === 0.333) scaledQuantity = "1/3";
      else if (scaledQuantity === 0.67 || scaledQuantity === 0.666) scaledQuantity = "2/3";
      else scaledQuantity = scaledQuantity.toFixed(2).replace(/\.00$/, '');
    }
    
    return ingredient.replace(match[0], `${scaledQuantity}${match[2]}`);
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
            {user && user.id === recipe.userId && (
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
            
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center gap-4">
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
              
              {recipe.userId && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <User size={14} />
                    </AvatarFallback>
                  </Avatar>
                  {loading ? (
                    <span className="animate-pulse">Loading creator...</span>
                  ) : creator ? (
                    <span>Recipe by {creator.username}</span>
                  ) : (
                    <span>Recipe by user</span>
                  )}
                </div>
              )}
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
                
                {recipe.originalIngredients && (
                  <IngredientScaler scale={scale} onScaleChange={setScale} />
                )}
                
                <ul className="space-y-2 pl-5">
                  {(recipe.originalIngredients ? recipe.originalIngredients : recipe.ingredients).map((ingredient, index) => (
                    <li key={index} className="list-disc">
                      {recipe.originalIngredients ? scaleIngredient(ingredient) : ingredient}
                    </li>
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
