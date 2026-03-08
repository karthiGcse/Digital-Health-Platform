import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
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
import Radiology from "@/pages/Radiology";
import Vaccination from "@/pages/Vaccination";
import Nutrition from "@/pages/Nutrition";
import Physiotherapy from "@/pages/Physiotherapy";
import ClinicalTrials from "@/pages/ClinicalTrials";
import Pathology from "@/pages/Pathology";
import CardiacRisk from "@/pages/CardiacRisk";
import MaternalHealth from "@/pages/MaternalHealth";
import DentalHealth from "@/pages/DentalHealth";
import Insurance from "@/pages/Insurance";
import SleepHealth from "@/pages/SleepHealth";
import Orthopedic from "@/pages/Orthopedic";
import FallDetection from "@/pages/FallDetection";
import ARSurgery from "@/pages/ARSurgery";
import Skincare from "@/pages/Skincare";
import BloodDonation from "@/pages/BloodDonation";
import Yoga from "@/pages/Yoga";
import BedAvailability from "@/pages/BedAvailability";
import Epigenetics from "@/pages/Epigenetics";
import SecondOpinion from "@/pages/SecondOpinion";
import FeverTracker from "@/pages/FeverTracker";
import DoctorReviews from "@/pages/DoctorReviews";
import HealthWallet from "@/pages/HealthWallet";
import Microbiome from "@/pages/Microbiome";
import HearingHealth from "@/pages/HearingHealth";
import Respiratory from "@/pages/Respiratory";
import Pharmacogenomics from "@/pages/Pharmacogenomics";
import PeerSupport from "@/pages/PeerSupport";
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
              <Route path="/radiology" element={<Radiology />} />
              <Route path="/vaccination" element={<Vaccination />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/physiotherapy" element={<Physiotherapy />} />
              <Route path="/clinical-trials" element={<ClinicalTrials />} />
              <Route path="/pathology" element={<Pathology />} />
              <Route path="/cardiac-risk" element={<CardiacRisk />} />
              <Route path="/maternal-health" element={<MaternalHealth />} />
              <Route path="/dental-health" element={<DentalHealth />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/sleep-health" element={<SleepHealth />} />
              <Route path="/orthopedic" element={<Orthopedic />} />
              <Route path="/fall-detection" element={<FallDetection />} />
              <Route path="/ar-surgery" element={<ARSurgery />} />
              <Route path="/skincare" element={<Skincare />} />
              <Route path="/blood-donation" element={<BloodDonation />} />
              <Route path="/yoga" element={<Yoga />} />
              <Route path="/bed-availability" element={<BedAvailability />} />
              <Route path="/epigenetics" element={<Epigenetics />} />
              <Route path="/second-opinion" element={<SecondOpinion />} />
              <Route path="/fever-tracker" element={<FeverTracker />} />
              <Route path="/doctor-reviews" element={<DoctorReviews />} />
              <Route path="/health-wallet" element={<HealthWallet />} />
              <Route path="/microbiome" element={<Microbiome />} />
              <Route path="/hearing-health" element={<HearingHealth />} />
              <Route path="/respiratory" element={<Respiratory />} />
              <Route path="/pharmacogenomics" element={<Pharmacogenomics />} />
              <Route path="/peer-support" element={<PeerSupport />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
