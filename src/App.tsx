import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import SymptomChecker from "@/pages/SymptomChecker";
import MedicineLookup from "@/pages/MedicineLookup";
import DrugInteractions from "@/pages/DrugInteractions";
import Prescriptions from "@/pages/Prescriptions";
import Reminders from "@/pages/Reminders";
import Telemedicine from "@/pages/Telemedicine";
import NearbyServices from "@/pages/NearbyServices";
import ComingSoon from "@/pages/ComingSoon";
import AIConsultation from "@/pages/AIConsultation";
import HealthAnalytics from "@/pages/HealthAnalytics";
import AIReports from "@/pages/AIReports";
import Emergency from "@/pages/Emergency";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/symptoms" element={<SymptomChecker />} />
              <Route path="/medicines" element={<MedicineLookup />} />
              <Route path="/interactions" element={<DrugInteractions />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/telemedicine" element={<Telemedicine />} />
              <Route path="/nearby" element={<NearbyServices />} />
              <Route path="/consultation" element={<PlaceholderPage title="AI Consultation" description="Chat with AI assistant coming in Phase 2." />} />
              <Route path="/analytics" element={<PlaceholderPage title="Health Analytics" description="Health analytics dashboard coming in Phase 2." />} />
              <Route path="/reports" element={<PlaceholderPage title="AI Reports" description="AI-generated health reports coming in Phase 2." />} />
              <Route path="/emergency" element={<PlaceholderPage title="Emergency" description="Emergency services and first-aid coming in Phase 2." />} />
              <Route path="/inventory" element={<PlaceholderPage title="Inventory" description="Pharmacist inventory management coming in Phase 2." />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
