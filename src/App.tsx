
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Candidatures from "./pages/Candidatures";
import Postes from "./pages/Postes";
import Recherche from "./pages/Recherche";
import Recruteurs from "./pages/Recruteurs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-recruit-gray-light">
          <Header />
          <div className="flex">
            <Navigation />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/candidatures" element={<Candidatures />} />
                <Route path="/postes" element={<Postes />} />
                <Route path="/recherche" element={<Recherche />} />
                <Route path="/recruteurs" element={<Recruteurs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
