import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";
import { ItemDetailScreen } from "./screens/ItemDetailScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";
import { useBackButton } from "./hooks/useBackButton";

const queryClient = new QueryClient();

import { useEffect } from "react";
import { storage } from "@/data/storage";

const AppContent = () => {
  useBackButton();

  useEffect(() => {
    storage.initialize();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/item/:id" element={<ItemDetailScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/settings/:section" element={<SettingsScreen />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
