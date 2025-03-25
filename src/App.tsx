
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocumentProvider } from "@/context/DocumentContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentView from "./pages/DocumentView";
import DocumentManagement from "./pages/DocumentManagement";
import RecipientView from "./pages/RecipientView";
import Login from "./pages/Login";
import Forbidden from "./pages/Forbidden";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="doc-signing-theme">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <DocumentProvider>
              <Sonner />
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forbidden" element={<Forbidden />} />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/upload" 
                  element={
                    <ProtectedRoute>
                      <DocumentUpload />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/view/:id" 
                  element={
                    <ProtectedRoute>
                      <DocumentView />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/manage" 
                  element={
                    <ProtectedRoute>
                      <DocumentManagement />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Public Routes */}
                <Route path="/sign/:id" element={<RecipientView />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DocumentProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
