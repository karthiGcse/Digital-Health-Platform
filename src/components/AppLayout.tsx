import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/symptoms': 'Symptom Checker',
  '/medicines': 'Medicine Lookup',
  '/interactions': 'Drug Interactions',
  '/prescriptions': 'Prescriptions',
  '/reminders': 'Smart Reminders',
  '/telemedicine': 'Telemedicine',
  '/nearby': 'Nearby Services',
  '/consultation': 'AI Consultation',
  '/analytics': 'Health Analytics',
  '/reports': 'AI Reports',
  '/emergency': 'Emergency',
  '/inventory': 'Inventory',
  '/coming-soon': 'Coming Soon',
};

const AppLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'S47 Health';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title={title} />
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
