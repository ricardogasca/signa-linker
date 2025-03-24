
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocumentProvider } from "@/context/DocumentContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentView from "./pages/DocumentView";
import RecipientView from "./pages/RecipientView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DocumentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/view/:id" element={<DocumentView />} />
            <Route path="/sign/:id" element={<RecipientView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DocumentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
