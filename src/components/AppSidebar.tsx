import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Pill, AlertTriangle, FileText, Bell, Video, MapPin,
  MessageSquare, BarChart3, FileBarChart, AlertCircle, Rocket, Package, Stethoscope,
  BookOpen, Users, Settings, LogOut, Heart, ChevronLeft, Scan, Brain, Globe
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth, AppRole } from '@/contexts/AuthContext';
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
  title: string;
  url: string;
  icon: any;
}

const navByRole: Record<AppRole, NavItem[]> = {
  patient: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Symptom Checker', url: '/symptoms', icon: Activity },
    { title: 'Medicine Lookup', url: '/medicines', icon: Pill },
    { title: 'Drug Interactions', url: '/interactions', icon: AlertTriangle },
    { title: 'Prescriptions', url: '/prescriptions', icon: FileText },
    { title: 'Reminders', url: '/reminders', icon: Bell },
    { title: 'Telemedicine', url: '/telemedicine', icon: Video },
    { title: 'Nearby Services', url: '/nearby', icon: MapPin },
    { title: 'AI Consultation', url: '/consultation', icon: MessageSquare },
    { title: 'Health Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'AI Reports', url: '/reports', icon: FileBarChart },
    { title: 'Emergency', url: '/emergency', icon: AlertCircle },
    { title: 'Coming Soon', url: '/coming-soon', icon: Rocket },
  ],
  pharmacist: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Medicine DB', url: '/medicines', icon: Pill },
    { title: 'Interactions', url: '/interactions', icon: AlertTriangle },
    { title: 'Prescriptions', url: '/prescriptions', icon: FileText },
    { title: 'Telemedicine', url: '/telemedicine', icon: Video },
    { title: 'Nearby Services', url: '/nearby', icon: MapPin },
    { title: 'AI Consultation', url: '/consultation', icon: MessageSquare },
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Inventory', url: '/inventory', icon: Package },
    { title: 'Coming Soon', url: '/coming-soon', icon: Rocket },
  ],
  doctor: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Symptom Analysis', url: '/symptoms', icon: Activity },
    { title: 'Drug Reference', url: '/medicines', icon: BookOpen },
    { title: 'Drug Interactions', url: '/interactions', icon: AlertTriangle },
    { title: 'Prescriptions', url: '/prescriptions', icon: FileText },
    { title: 'Telemedicine', url: '/telemedicine', icon: Video },
    { title: 'Nearby Services', url: '/nearby', icon: MapPin },
    { title: 'AI Consultation', url: '/consultation', icon: MessageSquare },
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Reports', url: '/reports', icon: FileBarChart },
    { title: 'Coming Soon', url: '/coming-soon', icon: Rocket },
  ],
  admin: [
    { title: 'Admin Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'System Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Medicine Database', url: '/medicines', icon: Pill },
    { title: 'Telemedicine', url: '/telemedicine', icon: Video },
    { title: 'Nearby Services', url: '/nearby', icon: MapPin },
    { title: 'AI Consultation', url: '/consultation', icon: MessageSquare },
    { title: 'Reports', url: '/reports', icon: FileBarChart },
    { title: 'Coming Soon', url: '/coming-soon', icon: Rocket },
  ],
};

export function AppSidebar() {
  const { profile, signOut } = useAuth();
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
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
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
                        {!collapsed && <span>{item.title}</span>}
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
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
