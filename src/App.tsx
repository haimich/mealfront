
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext";
import Dashboard from "./pages/Dashboard";
import RecipeDetail from "./pages/RecipeDetail";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RecipeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RecipeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
