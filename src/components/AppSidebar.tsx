import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Pill, AlertTriangle, FileText, Bell, Video, MapPin,
  MessageSquare, BarChart3, FileBarChart, AlertCircle, Rocket, Package, Stethoscope,
  BookOpen, Users, Settings, LogOut, Heart, ChevronLeft, Scan, Brain, Globe,
  Dna, Watch, FlaskConical, Shield, Plane, Building2, RefreshCw, Globe2,
  Syringe, Apple, Dumbbell, Microscope, TestTube, HeartPulse, Baby, Smile,
  ShieldCheck, Moon, Bone, PersonStanding, Glasses, Droplets, Move3D, Ear,
  Wind, Star, Wallet, CircleDot, ThermometerSun, UsersRound
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const roleGradients: Record<AppRole, string> = {
  patient: 'gradient-success',
  pharmacist: 'gradient-cool',
  doctor: 'gradient-health',
  admin: 'gradient-danger',
};

const roleColors: Record<AppRole, string> = {
  patient: 'bg-success/20 text-success',
  pharmacist: 'bg-info/20 text-info',
  doctor: 'bg-accent/20 text-accent',
  admin: 'bg-destructive/20 text-destructive',
};

interface NavItem {
  titleKey: string;
  url: string;
  icon: any;
}

const navByRole: Record<AppRole, NavItem[]> = {
  patient: [
    { titleKey: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboard },
    { titleKey: 'nav.symptomChecker', url: '/symptoms', icon: Activity },
    { titleKey: 'nav.medicineLookup', url: '/medicines', icon: Pill },
    { titleKey: 'nav.drugInteractions', url: '/interactions', icon: AlertTriangle },
    { titleKey: 'nav.prescriptions', url: '/prescriptions', icon: FileText },
    { titleKey: 'nav.reminders', url: '/reminders', icon: Bell },
    { titleKey: 'nav.telemedicine', url: '/telemedicine', icon: Video },
    { titleKey: 'nav.nearby', url: '/nearby', icon: MapPin },
    { titleKey: 'nav.consultation', url: '/consultation', icon: MessageSquare },
    { titleKey: 'nav.imageDiagnosis', url: '/image-diagnosis', icon: Scan },
    { titleKey: 'nav.mentalHealth', url: '/mental-health', icon: Brain },
    { titleKey: 'nav.familyHealth', url: '/family-health', icon: Users },
    { titleKey: 'nav.voiceAssistant', url: '/voice-assistant', icon: Globe },
    { titleKey: 'nav.geneticProfiling', url: '/genetic-profiling', icon: Dna },
    { titleKey: 'nav.wearables', url: '/wearables', icon: Watch },
    { titleKey: 'nav.labBooking', url: '/lab-booking', icon: FlaskConical },
    { titleKey: 'nav.blockchain', url: '/blockchain-records', icon: Shield },
    { titleKey: 'nav.droneDelivery', url: '/drone-delivery', icon: Plane },
    { titleKey: 'nav.hospitalQueue', url: '/hospital-queue', icon: Building2 },
    { titleKey: 'nav.autoRefill', url: '/auto-refill', icon: RefreshCw },
    { titleKey: 'nav.globalTelemedicine', url: '/global-telemedicine', icon: Globe2 },
    { titleKey: 'nav.radiology', url: '/radiology', icon: Stethoscope },
    { titleKey: 'nav.vaccination', url: '/vaccination', icon: Syringe },
    { titleKey: 'nav.nutrition', url: '/nutrition', icon: Apple },
    { titleKey: 'nav.physiotherapy', url: '/physiotherapy', icon: Dumbbell },
    
    { titleKey: 'nav.pathology', url: '/pathology', icon: TestTube },
    { titleKey: 'nav.cardiacRisk', url: '/cardiac-risk', icon: HeartPulse },
    { titleKey: 'nav.maternalHealth', url: '/maternal-health', icon: Baby },
    { titleKey: 'nav.dentalHealth', url: '/dental-health', icon: Smile },
    { titleKey: 'nav.insurance', url: '/insurance', icon: ShieldCheck },
    { titleKey: 'nav.sleepHealth', url: '/sleep-health', icon: Moon },
    { titleKey: 'nav.orthopedic', url: '/orthopedic', icon: Bone },
    { titleKey: 'nav.fallDetection', url: '/fall-detection', icon: PersonStanding },
    { titleKey: 'nav.arSurgery', url: '/ar-surgery', icon: Glasses },
    { titleKey: 'nav.skincare', url: '/skincare', icon: Droplets },
    { titleKey: 'nav.bloodDonation', url: '/blood-donation', icon: CircleDot },
    { titleKey: 'nav.yoga', url: '/yoga', icon: Move3D },
    { titleKey: 'nav.bedAvailability', url: '/bed-availability', icon: Building2 },
    { titleKey: 'nav.epigenetics', url: '/epigenetics', icon: Dna },
    { titleKey: 'nav.secondOpinion', url: '/second-opinion', icon: Stethoscope },
    { titleKey: 'nav.feverTracker', url: '/fever-tracker', icon: ThermometerSun },
    { titleKey: 'nav.doctorReviews', url: '/doctor-reviews', icon: Star },
    { titleKey: 'nav.healthWallet', url: '/health-wallet', icon: Wallet },
    { titleKey: 'nav.microbiome', url: '/microbiome', icon: Microscope },
    { titleKey: 'nav.hearingHealth', url: '/hearing-health', icon: Ear },
    { titleKey: 'nav.respiratory', url: '/respiratory', icon: Wind },
    { titleKey: 'nav.pharmacogenomics', url: '/pharmacogenomics', icon: TestTube },
    { titleKey: 'nav.peerSupport', url: '/peer-support', icon: UsersRound },
    { titleKey: 'nav.analytics', url: '/analytics', icon: BarChart3 },
    { titleKey: 'nav.reports', url: '/reports', icon: FileBarChart },
    { titleKey: 'nav.emergency', url: '/emergency', icon: AlertCircle },
    { titleKey: 'nav.comingSoon', url: '/coming-soon', icon: Rocket },
  ],
  pharmacist: [
    { titleKey: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboard },
    { titleKey: 'nav.medicineLookup', url: '/medicines', icon: Pill },
    { titleKey: 'nav.drugInteractions', url: '/interactions', icon: AlertTriangle },
    { titleKey: 'nav.prescriptions', url: '/prescriptions', icon: FileText },
    { titleKey: 'nav.telemedicine', url: '/telemedicine', icon: Video },
    { titleKey: 'nav.nearby', url: '/nearby', icon: MapPin },
    { titleKey: 'nav.consultation', url: '/consultation', icon: MessageSquare },
    { titleKey: 'nav.imageDiagnosis', url: '/image-diagnosis', icon: Scan },
    { titleKey: 'nav.voiceAssistant', url: '/voice-assistant', icon: Globe },
    { titleKey: 'nav.analytics', url: '/analytics', icon: BarChart3 },
    { titleKey: 'nav.inventory', url: '/inventory', icon: Package },
    { titleKey: 'nav.comingSoon', url: '/coming-soon', icon: Rocket },
  ],
  doctor: [
    { titleKey: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboard },
    { titleKey: 'nav.symptomChecker', url: '/symptoms', icon: Activity },
    { titleKey: 'nav.medicineLookup', url: '/medicines', icon: BookOpen },
    { titleKey: 'nav.drugInteractions', url: '/interactions', icon: AlertTriangle },
    { titleKey: 'nav.prescriptions', url: '/prescriptions', icon: FileText },
    { titleKey: 'nav.telemedicine', url: '/telemedicine', icon: Video },
    { titleKey: 'nav.nearby', url: '/nearby', icon: MapPin },
    { titleKey: 'nav.consultation', url: '/consultation', icon: MessageSquare },
    { titleKey: 'nav.imageDiagnosis', url: '/image-diagnosis', icon: Scan },
    { titleKey: 'nav.mentalHealth', url: '/mental-health', icon: Brain },
    { titleKey: 'nav.familyHealth', url: '/family-health', icon: Users },
    { titleKey: 'nav.voiceAssistant', url: '/voice-assistant', icon: Globe },
    { titleKey: 'nav.analytics', url: '/analytics', icon: BarChart3 },
    { titleKey: 'nav.reports', url: '/reports', icon: FileBarChart },
    { titleKey: 'nav.comingSoon', url: '/coming-soon', icon: Rocket },
  ],
  admin: [
    { titleKey: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboard },
    { titleKey: 'nav.analytics', url: '/analytics', icon: BarChart3 },
    { titleKey: 'nav.medicineLookup', url: '/medicines', icon: Pill },
    { titleKey: 'nav.telemedicine', url: '/telemedicine', icon: Video },
    { titleKey: 'nav.nearby', url: '/nearby', icon: MapPin },
    { titleKey: 'nav.consultation', url: '/consultation', icon: MessageSquare },
    { titleKey: 'nav.imageDiagnosis', url: '/image-diagnosis', icon: Scan },
    { titleKey: 'nav.reports', url: '/reports', icon: FileBarChart },
    { titleKey: 'nav.comingSoon', url: '/coming-soon', icon: Rocket },
  ],
};

export function AppSidebar() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const role = profile?.role || 'patient';
  const items = navByRole[role];

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-health flex items-center justify-center shrink-0 shadow-glow">
            <Heart className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-heading font-bold text-sm text-sidebar-primary-foreground">S47 Health</h2>
              <p className="text-xs text-sidebar-foreground/60">Telepharmacy</p>
            </div>
          )}
        </div>
        {!collapsed && profile && (
          <div className="mt-4 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
            <p className="text-sm font-medium text-sidebar-primary-foreground truncate">{profile.name || profile.email}</p>
            <Badge className={cn('mt-1 text-[10px] font-semibold capitalize border-0', roleColors[role])}>
              {role}
            </Badge>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider font-semibold">{t('nav.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const title = t(item.titleKey);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                          'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        )}
                        activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-medium shadow-sm"
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
                        {!collapsed && <span>{title}</span>}
                        {!collapsed && isActive && (
                          <div className="ml-auto h-2 w-2 rounded-full gradient-health shadow-glow" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
