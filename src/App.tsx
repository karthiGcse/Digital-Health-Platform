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
import ImageDiagnosis from "@/pages/ImageDiagnosis";
import MentalHealth from "@/pages/MentalHealth";
import FamilyHealthHub from "@/pages/FamilyHealthHub";
import VoiceAssistant from "@/pages/VoiceAssistant";
import GeneticProfiling from "@/pages/GeneticProfiling";
import WearableIntegration from "@/pages/WearableIntegration";
import HomeLabBooking from "@/pages/HomeLabBooking";
import BlockchainRecords from "@/pages/BlockchainRecords";
import DroneDelivery from "@/pages/DroneDelivery";
import HospitalQueue from "@/pages/HospitalQueue";
import AutoRefill from "@/pages/AutoRefill";
import GlobalTelemedicine from "@/pages/GlobalTelemedicine";
import PharmacyInventory from "@/pages/PharmacyInventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
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
              <Route path="/consultation" element={<AIConsultation />} />
              <Route path="/analytics" element={<HealthAnalytics />} />
              <Route path="/reports" element={<AIReports />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/inventory" element={<PharmacyInventory />} />
              <Route path="/image-diagnosis" element={<ImageDiagnosis />} />
              <Route path="/mental-health" element={<MentalHealth />} />
              <Route path="/family-health" element={<FamilyHealthHub />} />
              <Route path="/voice-assistant" element={<VoiceAssistant />} />
              <Route path="/genetic-profiling" element={<GeneticProfiling />} />
              <Route path="/wearables" element={<WearableIntegration />} />
              <Route path="/lab-booking" element={<HomeLabBooking />} />
              <Route path="/blockchain-records" element={<BlockchainRecords />} />
              <Route path="/drone-delivery" element={<DroneDelivery />} />
              <Route path="/hospital-queue" element={<HospitalQueue />} />
              <Route path="/auto-refill" element={<AutoRefill />} />
              <Route path="/global-telemedicine" element={<GlobalTelemedicine />} />
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
