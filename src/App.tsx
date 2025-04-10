
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
import TicketPage from "./pages/tickets/[id]";
import WorkspaceSettingsPage from "./pages/workspace-settings";
import AIConfigPage from "./pages/ai-config";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SecurityPostureDashboard from "./components/dashboard/SecurityPosture";
import TeamDashboardPage from "./pages/dashboard/team";
import { UserRole } from "./contexts/AuthContext";

const queryClient = new QueryClient();

/**
 * Role requirements for different pages based on the SecureCanvas platform structure
 * 
 * Individual - Students, Bug Hunters, Consultants
 * Team Member - Security Professionals in Organizations
 * Team Manager - Security Leaders, CISOs
 * Administrator - Platform Administrators
 */

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
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Core Pages - Available to all authenticated users */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="/document/:id" element={<ProtectedRoute><DocumentPage /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
              <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBasePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              {/* Ticketing System Routes */}
              <Route path="/ticketing" element={
                <ProtectedRoute>
                  <TicketingPage />
                </ProtectedRoute>
              } />
              <Route path="/tickets/:id" element={
                <ProtectedRoute>
                  <TicketPage />
                </ProtectedRoute>
              } />
              
              {/* Team Member+ Routes */}
              <Route path="/dashboard/security" element={
                <ProtectedRoute requiredRoles={['team_member', 'team_manager', 'administrator']}>
                  <SecurityPostureDashboard />
                </ProtectedRoute>
              } />
              
              {/* Team Manager+ Routes */}
              <Route path="/dashboard/team" element={
                <ProtectedRoute requiredRoles={['team_manager', 'administrator']}>
                  <TeamDashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Extension Modules */}
              {/* Asset Management - Team Member+ */}
              <Route path="/assets" element={
                <ProtectedRoute requiredRoles={['team_member', 'team_manager', 'administrator']}>
                  <AssetsPage />
                </ProtectedRoute>
              } />
              
              {/* Intelligence - Team Member+ */}
              <Route path="/threat-intel" element={
                <ProtectedRoute requiredRoles={['team_member', 'team_manager', 'administrator']}>
                  <ThreatIntelPage />
                </ProtectedRoute>
              } />
              
              {/* Compliance - Team Member+ */}
              <Route path="/compliance" element={
                <ProtectedRoute requiredRoles={['team_member', 'team_manager', 'administrator']}>
                  <CompliancePage />
                </ProtectedRoute>
              } />
              
              {/* AI Config - Team Manager+ */}
              <Route path="/ai-config" element={
                <ProtectedRoute requiredRoles={['team_manager', 'administrator']}>
                  <AIConfigPage />
                </ProtectedRoute>
              } />
              
              {/* Specialized Views */}
              {/* Bug Bounty - All users */}
              <Route path="/bug-bounty" element={<ProtectedRoute><BugBountyPage /></ProtectedRoute>} />
              
              {/* Red Team Ops - Team Member+ */}
              <Route path="/red-team" element={
                <ProtectedRoute requiredRoles={['team_member', 'team_manager', 'administrator']}>
                  <RedTeamPage />
                </ProtectedRoute>
              } />
              
              {/* SOC/Blue Team Ops - Team Member+ */}
              <Route path="/soc" element={
                <ProtectedRoute requiredRoles={['team_member', 'team_manager', 'administrator']}>
                  <SOCPage />
                </ProtectedRoute>
              } />
              
              {/* Learning Hub - All users */}
              <Route path="/learning" element={<ProtectedRoute><LearningHubPage /></ProtectedRoute>} />
              
              {/* Client Portal - Individual/Team Manager+ */}
              <Route path="/clients" element={
                <ProtectedRoute requiredRoles={['individual', 'team_manager', 'administrator']}>
                  <ClientPortalPage />
                </ProtectedRoute>
              } />
              
              {/* Administration Routes - Administrator only */}
              <Route path="/workspace-settings" element={
                <ProtectedRoute requiredRoles={['administrator']}>
                  <WorkspaceSettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
