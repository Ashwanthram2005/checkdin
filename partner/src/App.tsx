import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppTopBar } from './components/AppTopBar';
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog';
import { Sidebar } from './components/Sidebar';
import { PartnerPortal } from './pages/PartnerPortal';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { Rooms } from './pages/Rooms';
import { Pricing } from './pages/Pricing';
import { Availability } from './pages/Availability';
import { Reviews } from './pages/Reviews';
import { Revenue } from './pages/Revenue';
import { Payouts } from './pages/Payouts';
import { Reports } from './pages/Reports';
import { RulesPolicies } from './pages/RulesPolicies';
import { AuditLog } from './pages/AuditLog';
import { Support } from './pages/Support';
import { Settings } from './pages/Settings';

function Shell() {
  const { isAuthenticated } = useAuth();
  const [active, setActive] = useState('Dashboard');

  if (!isAuthenticated) return <PartnerPortal />;

  const pages: Record<string, React.ReactNode> = {
    Dashboard: <Dashboard />,
    Bookings: <Bookings />,
    Rooms: <Rooms />,
    Pricing: <Pricing />,
    Availability: <Availability />,
    Reviews: <Reviews />,
    Revenue: <Revenue />,
    Payouts: <Payouts />,
    Reports: <Reports />,
    'Rules & Policies': <RulesPolicies />,
    'Audit Log': <AuditLog />,
    Support: <Support />,
    Settings: <Settings />
  };

  return (
    <div className="flex h-screen w-full flex-col bg-canvas text-ink">
      <AppTopBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar active={active} onSelect={setActive} />
        {pages[active] ?? <Dashboard />}
      </div>
      <SessionTimeoutDialog />
    </div>);

}

export function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>);

}