
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Auth from "./pages/Auth";
import LandingPage from "./pages/Landing";
import DocumentPage from "./pages/document/[id]";
import ProfilePage from "./pages/profile";
import TemplatesPage from "./pages/templates";
import LearningHubPage from "./pages/learning";
import BugBountyPage from "./pages/bug-bounty";
import CompliancePage from "./pages/compliance";
import KnowledgeBasePage from "./pages/knowledge-base";
import ClientPortalPage from "./pages/client-portal";
import SOCPage from "./pages/soc";
import AssetsPage from "./pages/assets";
import RedTeamPage from "./pages/red-team";
import ThreatIntelPage from "./pages/threat-intel";
import TicketingPage from "./pages/ticketing";
import WorkspaceSettingsPage from "./pages/workspace-settings";
import AIConfigPage from "./pages/ai-config";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="/document/:id" element={<ProtectedRoute><DocumentPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
              <Route path="/learning" element={<ProtectedRoute><LearningHubPage /></ProtectedRoute>} />
              <Route path="/bug-bounty" element={<ProtectedRoute><BugBountyPage /></ProtectedRoute>} />
              <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
              {/* Knowledge Base */}
              <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBasePage /></ProtectedRoute>} />
              {/* Client Portal */}
              <Route path="/clients" element={<ProtectedRoute><ClientPortalPage /></ProtectedRoute>} />
              {/* Enterprise Pages */}
              <Route path="/soc" element={<ProtectedRoute><SOCPage /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
              {/* Specialized Security Team Pages */}
              <Route path="/red-team" element={<ProtectedRoute><RedTeamPage /></ProtectedRoute>} />
              <Route path="/threat-intel" element={<ProtectedRoute><ThreatIntelPage /></ProtectedRoute>} />
              <Route path="/ticketing" element={<ProtectedRoute><TicketingPage /></ProtectedRoute>} />
              {/* Administration Pages */}
              <Route path="/workspace-settings" element={<ProtectedRoute><WorkspaceSettingsPage /></ProtectedRoute>} />
              <Route path="/ai-config" element={<ProtectedRoute><AIConfigPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
