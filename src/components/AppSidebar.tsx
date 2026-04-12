import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Pill, AlertTriangle, FileText, Bell, Video, MapPin,
  MessageSquare, BarChart3, FileBarChart, AlertCircle, Rocket, Package, Stethoscope,
  BookOpen, Users, Settings, LogOut, Heart, ChevronLeft, Scan, Brain, Globe,
  Dna, Watch, FlaskConical, Shield, Plane, Building2, RefreshCw, Globe2,
  Syringe, Apple, Dumbbell, Microscope, TestTube, HeartPulse, Baby, Smile,
  ShieldCheck, Moon, Bone, PersonStanding, Glasses, Droplets, Move3D, Ear,
  Wind, Star, Wallet, CircleDot, ThermometerSun, UsersRound, Sparkles
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
  patient: 'from-emerald-500 to-teal-500',
  pharmacist: 'from-blue-500 to-indigo-500',
  doctor: 'from-violet-500 to-purple-500',
  admin: 'from-rose-500 to-red-500',
};

const roleColors: Record<AppRole, string> = {
  patient: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  pharmacist: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  doctor: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  admin: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
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
    { titleKey: 'nav.nutrition', url: '/nutrition', icon: Apple },
    { titleKey: 'nav.cardiacRisk', url: '/cardiac-risk', icon: HeartPulse },
    { titleKey: 'nav.insurance', url: '/insurance', icon: ShieldCheck },
    { titleKey: 'nav.bloodDonation', url: '/blood-donation', icon: CircleDot },
    { titleKey: 'nav.epigenetics', url: '/epigenetics', icon: Dna },
    { titleKey: 'nav.healthWallet', url: '/health-wallet', icon: Wallet },
    { titleKey: 'nav.hearingHealth', url: '/hearing-health', icon: Ear },
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
    { titleKey: 'Patient Registration', url: '/patient-registration', icon: Users },
    { titleKey: 'Doctor Dashboard', url: '/doctor-queue', icon: Stethoscope },
    { titleKey: 'Smart Pharmacy', url: '/smart-pharmacy', icon: Package },
    { titleKey: 'Scan Centre', url: '/scan-centre', icon: Microscope },
    { titleKey: 'Lab Centre', url: '/lab-centre', icon: FlaskConical },
    { titleKey: 'Injection Centre', url: '/injection-centre', icon: Syringe },
    { titleKey: 'Bed Management', url: '/bed-management', icon: Building2 },
    { titleKey: 'Patient Notifications', url: '/patient-notifications', icon: Bell },
    { titleKey: 'AI Assistant', url: '/ai-assistant', icon: Brain },
    { titleKey: 'nav.analytics', url: '/analytics', icon: BarChart3 },
    { titleKey: 'nav.reports', url: '/reports', icon: FileBarChart },
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
      {/* Deep cosmic sidebar background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
        background: 'linear-gradient(180deg, #0f0720 0%, #0a0e1f 40%, #060b16 100%)',
      }}>
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[100px] opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
        <div className="absolute bottom-[30%] left-0 w-[150px] h-[150px] rounded-full blur-[80px] opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[120px] h-[120px] rounded-full blur-[70px] opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
      </div>

      <SidebarHeader className="p-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg" style={{ boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
            <Heart className="h-4.5 w-4.5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-heading font-bold text-sm text-white">S47 Health</h2>
              <p className="text-[10px] text-white/40 font-medium">Telepharmacy</p>
            </div>
          )}
        </div>
        {!collapsed && profile && (
          <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${roleGradients[role]} flex items-center justify-center shadow-md`}>
                <span className="text-[10px] font-bold text-white">
                  {(profile.name || profile.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white/90 truncate">{profile.name || profile.email}</p>
                <Badge className={cn('mt-0.5 text-[9px] font-bold capitalize border px-1.5 py-0', roleColors[role])}>
                  {role}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 relative z-10">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/25 text-[9px] uppercase tracking-[0.15em] font-bold mb-1">{t('nav.navigation')}</SidebarGroupLabel>
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
                          'flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-200',
                          'text-white/50 hover:text-white/90 hover:bg-white/[0.06]',
                        )}
                        activeClassName="bg-gradient-to-r from-violet-500/15 to-cyan-500/10 text-white font-semibold border border-white/[0.08] shadow-sm"
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-violet-400" : "text-white/40")} />
                        {!collapsed && <span>{title}</span>}
                        {!collapsed && isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-sm" style={{ boxShadow: '0 0 6px rgba(139,92,246,0.5)' }} />
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

      <SidebarFooter className="p-3 relative z-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-3 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-[13px] font-medium">{t('nav.logout')}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
