import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Candidatures from "./pages/Candidatures";
import Postes from "./pages/Postes";
import Recherche from "./pages/Recherche";
import Recruteurs from "./pages/Recruteurs";
import Interviews from "./pages/Interviews";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="h-screen bg-recruit-gray-light flex flex-col overflow-hidden">
                  <Header />
                  <div className="flex flex-1 overflow-hidden">
                    <Navigation />
                    <main className="flex-1 overflow-y-auto">
                      <div className="p-6">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/candidatures" element={<Candidatures />} />
                          <Route path="/postes" element={<Postes />} />
                          <Route path="/entretiens" element={<Interviews />} />
                          <Route path="/recruteurs" element={<Recruteurs />} />
                          <Route path="/recherche" element={<Recherche />} />
                          <Route path="/chat" element={<Chat />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/notifications" element={<Notifications />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
