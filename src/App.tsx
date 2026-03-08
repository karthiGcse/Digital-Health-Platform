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
import PlaceholderPage from "@/pages/PlaceholderPage";
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
              <Route path="/radiology" element={<PlaceholderPage title="AI Radiology Assistant" description="Advanced AI analysis of CT scans, MRIs, and ultrasounds with 3D visualization." />} />
              <Route path="/vaccination" element={<PlaceholderPage title="Smart Vaccination Scheduler" description="Automated vaccination scheduling for all age groups with booster reminders." />} />
              <Route path="/nutrition" element={<PlaceholderPage title="AI Nutrition & Diet Planner" description="Personalized meal plans based on your health conditions and goals." />} />
              <Route path="/physiotherapy" element={<PlaceholderPage title="Physiotherapy & Rehab Coach" description="AI-guided exercise programs for injury recovery with video demos." />} />
              <Route path="/clinical-trials" element={<PlaceholderPage title="Clinical Trial Matcher" description="Match with relevant clinical trials worldwide with eligibility screening." />} />
              <Route path="/pathology" element={<PlaceholderPage title="AI Pathology Report Analyzer" description="Automated analysis and plain-language summaries of lab reports." />} />
              <Route path="/cardiac-risk" element={<PlaceholderPage title="Cardiac Risk Predictor" description="AI-powered heart disease risk assessment with 10-year scoring." />} />
              <Route path="/maternal-health" element={<PlaceholderPage title="Maternal & Child Health Tracker" description="Pregnancy monitoring, baby milestone tracking, and pediatric care." />} />
              <Route path="/dental-health" element={<PlaceholderPage title="Dental Health AI Scanner" description="Scan teeth and gums for early detection of dental issues." />} />
              <Route path="/insurance" element={<PlaceholderPage title="Health Insurance Optimizer" description="AI-powered insurance plan comparison and claim assistance." />} />
              <Route path="/sleep-health" element={<PlaceholderPage title="Sleep Health Tracker" description="Monitor and improve your sleep quality with AI insights." />} />
              <Route path="/orthopedic" element={<PlaceholderPage title="Orthopedic AI Assistant" description="AI-powered bone and joint health assessment with posture analysis." />} />
              <Route path="/fall-detection" element={<PlaceholderPage title="Elderly Fall Detection" description="Smart fall detection and emergency alerts for seniors." />} />
              <Route path="/ar-surgery" element={<PlaceholderPage title="AR Surgery Visualization" description="Augmented reality surgical planning with 3D organ mapping." />} />
              <Route path="/skincare" element={<PlaceholderPage title="Skin Care AI Advisor" description="Personalized skincare routines based on AI skin analysis." />} />
              <Route path="/blood-donation" element={<PlaceholderPage title="Blood Donation Network" description="Connect blood donors with nearby recipients in real-time." />} />
              <Route path="/yoga" element={<PlaceholderPage title="Yoga & Meditation Guide" description="AI-guided yoga sessions and meditation programs with pose correction." />} />
              <Route path="/bed-availability" element={<PlaceholderPage title="Hospital Bed Availability" description="Real-time hospital bed tracking across your city with ICU alerts." />} />
              <Route path="/epigenetics" element={<PlaceholderPage title="Epigenetics Tracker" description="Track how lifestyle changes affect your gene expression." />} />
              <Route path="/second-opinion" element={<PlaceholderPage title="AI Second Opinion" description="Get AI-powered second opinions on diagnoses from global specialists." />} />
              <Route path="/fever-tracker" element={<PlaceholderPage title="Fever & Infection Tracker" description="Smart thermometer integration with infection pattern detection." />} />
              <Route path="/doctor-reviews" element={<PlaceholderPage title="Doctor Rating & Reviews" description="Rate and review doctors with verified patient feedback." />} />
              <Route path="/health-wallet" element={<PlaceholderPage title="Health Wallet & Payments" description="Unified health payments, insurance claims, and expense tracking." />} />
              <Route path="/microbiome" element={<PlaceholderPage title="Microbiome Analysis" description="Analyze gut health and microbiome composition with AI insights." />} />
              <Route path="/hearing-health" element={<PlaceholderPage title="Hearing Health Monitor" description="Track hearing health and detect early hearing loss." />} />
              <Route path="/respiratory" element={<PlaceholderPage title="Respiratory Health AI" description="AI-powered lung health monitoring using breath analysis." />} />
              <Route path="/pharmacogenomics" element={<PlaceholderPage title="Pharmacogenomics" description="Predict drug responses based on your genetic profile." />} />
              <Route path="/peer-support" element={<PlaceholderPage title="Peer Health Support Groups" description="Connect with others managing similar health conditions." />} />
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
