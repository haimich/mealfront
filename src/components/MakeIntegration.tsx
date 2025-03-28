
import React, { useState } from 'react';
import { Loader2, Send, Bot } from 'lucide-react';
import { triggerMakeWebhook } from '@/services/makeService';
import { useRecipes } from '@/context/RecipeContext';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface MakeIntegrationProps {
  recipe: Recipe;
}

const MakeIntegration: React.FC<MakeIntegrationProps> = ({ recipe }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const handleTriggerMake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Create payload with recipe data and user prompt
      const payload = {
        recipe: {
          id: recipe.id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          notes: recipe.notes || '',
          duration: recipe.duration,
        },
        prompt: prompt || 'Analyze this recipe',
        timestamp: new Date().toISOString(),
        source: 'recipe-app'
      };
      
      const response = await triggerMakeWebhook(webhookUrl, payload);
      
      if (response.success) {
        setResult('Make.com scenario triggered successfully. Check your Make.com dashboard for results.');
      } else {
        setResult(`Error: ${response.message}`);
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-4 mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Bot size={20} />
          Make.com LLM Integration
        </h3>
        <p className="text-sm text-muted-foreground">
          Connect this recipe to your Make.com scenario to analyze it with an LLM or perform other actions.
        </p>
      </div>
      
      <form onSubmit={handleTriggerMake} className="space-y-4">
        <div>
          <Label htmlFor="webhook-url">Make.com Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="https://hook.us.make.com/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            required
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your Make.com webhook URL to connect with your scenario
          </p>
        </div>
        
        <div>
          <Label htmlFor="prompt">LLM Prompt (Optional)</Label>
          <Textarea
            id="prompt"
            placeholder="Give me cooking tips for this recipe..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !webhookUrl}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send to Make.com
            </>
          )}
        </Button>
      </form>
      
      {result && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p>{result}</p>
        </div>
      )}
    </Card>
  );
};

export default MakeIntegration;
