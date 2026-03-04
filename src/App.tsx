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
import ComingSoon from "@/pages/ComingSoon";
import PlaceholderPage from "@/pages/PlaceholderPage";
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
              <Route path="/symptoms" element={<PlaceholderPage title="Symptom Checker" description="AI-powered symptom analysis coming in Phase 2." />} />
              <Route path="/medicines" element={<PlaceholderPage title="Medicine Lookup" description="Search and explore medicine database coming in Phase 2." />} />
              <Route path="/interactions" element={<PlaceholderPage title="Drug Interactions" description="Check drug interactions coming in Phase 2." />} />
              <Route path="/prescriptions" element={<PlaceholderPage title="Digital Prescriptions" description="OCR-powered prescription management coming in Phase 2." />} />
              <Route path="/reminders" element={<PlaceholderPage title="Smart Reminders" description="Medication reminders coming in Phase 2." />} />
              <Route path="/telemedicine" element={<PlaceholderPage title="Telemedicine" description="Video consultations coming in Phase 2." />} />
              <Route path="/nearby" element={<PlaceholderPage title="Nearby Services" description="Find hospitals and pharmacies nearby coming in Phase 2." />} />
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
