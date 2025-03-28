
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Edit, Trash2, Share, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import StarRating from '@/components/StarRating';
import IngredientScaler from '@/components/IngredientScaler';
import MakeIntegration from '@/components/MakeIntegration';
import { useRecipes } from '@/context/RecipeContext';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipe, deleteRecipe, rateRecipe, loading } = useRecipes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(getRecipe(id || ''));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showMakeIntegration, setShowMakeIntegration] = useState(false);

  useEffect(() => {
    if (!loading) {
      const foundRecipe = getRecipe(id || '');
      setRecipe(foundRecipe);

      if (!foundRecipe) {
        navigate('/');
      }
    }
  }, [id, getRecipe, loading, navigate]);

  if (loading || !recipe) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading recipe...</div>
        </div>
      </Layout>
    );
  }

  const handleDelete = async () => {
    await deleteRecipe(recipe.id);
    navigate('/');
  };

  const handleRating = (rating: number) => {
    rateRecipe(recipe.id, rating);
  };

  const canEdit = user && recipe.userId === user.id;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium hover:text-accent transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Recipes
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {recipe.imageUrl && (
            <div className="md:w-1/2 lg:w-2/5">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <div className={`${recipe.imageUrl ? 'md:w-1/2 lg:w-3/5' : 'w-full'}`}>
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">{recipe.duration} min</span>
              </div>
              
              <div className="flex items-center">
                <StarRating
                  rating={recipe.rating || 0}
                  onRate={handleRating}
                  editable={!!user}
                />
              </div>
            </div>

            {recipe.source && (
              <div className="mb-4">
                <a
                  href={recipe.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-accent hover:underline"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Original Source
                </a>
              </div>
            )}

            {canEdit && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/edit/${recipe.id}`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Recipe</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowMakeIntegration(!showMakeIntegration)}
                >
                  <Share className="h-4 w-4 mr-1" />
                  {showMakeIntegration ? 'Hide Make.com' : 'Connect to Make.com'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {showMakeIntegration && recipe && (
          <MakeIntegration recipe={recipe} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            
            {recipe.originalIngredients && recipe.originalIngredients.length > 0 && (
              <IngredientScaler
                originalIngredients={recipe.originalIngredients}
                ingredients={recipe.ingredients}
                setIngredients={() => {}}
                readOnly={true}
              />
            )}
            
            <ul className="space-y-2 mt-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline">
                  <span className="block w-full py-1">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="prose max-w-none">
              {recipe.instructions.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {recipe.notes && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <div className="prose max-w-none bg-muted/50 p-4 rounded-lg">
                  {recipe.notes.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetail;
