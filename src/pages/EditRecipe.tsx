
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RecipeForm from '@/components/RecipeForm';
import { useRecipes } from '@/context/RecipeContext';

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipe } = useRecipes();
  
  const recipe = getRecipe(id || '');
  
  if (!recipe) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Edit Recipe</h1>
        <RecipeForm mode="edit" initialData={recipe} />
      </div>
    </Layout>
  );
};

export default EditRecipe;
