
import React from 'react';
import Layout from '@/components/Layout';
import RecipeForm from '@/components/RecipeForm';

const CreateRecipe: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Create New Recipe</h1>
        <RecipeForm mode="create" />
      </div>
    </Layout>
  );
};

export default CreateRecipe;
