import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Planner from "./pages/Planner";
import NotFound from "./pages/NotFound";
import AccessPopup from "./components/AccessPopup";

const queryClient = new QueryClient();

const App = () => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms in this session
    const accepted = sessionStorage.getItem('kcet-terms-accepted');
    if (accepted === 'true') {
      setHasAcceptedTerms(true);
    }
  }, []);

  const handleAccessGranted = () => {
    sessionStorage.setItem('kcet-terms-accepted', 'true');
    setHasAcceptedTerms(true);
  };

  if (!hasAcceptedTerms) {
    return <AccessPopup onAccessGranted={handleAccessGranted} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planner" element={<Planner />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
