import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppTopBar } from './components/AppTopBar';
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog';
import { Sidebar } from './components/Sidebar';
import { PartnerPortal } from './pages/PartnerPortal';
import { CommandCenter } from './pages/CommandCenter';
import { Bookings } from './pages/Bookings';
import { Extensions } from './pages/Extensions';
import { GuestMessaging } from './pages/GuestMessaging';
import { Notifications } from './pages/Notifications';
import { Revenue } from './pages/Revenue';
import { ExtensionRevenue } from './pages/ExtensionRevenue';
import { Forecasting } from './pages/Forecasting';
import { Reports } from './pages/Reports';
import { DynamicPricing } from './pages/DynamicPricing';
import { Promotions } from './pages/Promotions';
import { Occupancy } from './pages/Occupancy';
import { CustomerInsights } from './pages/CustomerInsights';
import { ExtensionDemand } from './pages/ExtensionDemand';
import { Cancellations } from './pages/Cancellations';
import { AiAssistant } from './pages/AiAssistant';
import { PerformanceScore } from './pages/PerformanceScore';
import { Availability } from './pages/Availability';
import { PropertyExperience } from './pages/PropertyExperience';
import { Reviews } from './pages/Reviews';
import { RulesPolicies } from './pages/RulesPolicies';
import { Payouts } from './pages/Payouts';
import { Properties } from './pages/Properties';
import { AuditLog } from './pages/AuditLog';
import { Support } from './pages/Support';
import { Settings } from './pages/Settings';
import { portfolio } from './data/operations';

function Shell() {
  const { isAuthenticated } = useAuth();
  const [active, setActive] = useState('Command Center');
  const [propertyId, setPropertyId] = useState(portfolio[0].id);

  if (!isAuthenticated) return <PartnerPortal />;

  const pages: Record<string, React.ReactNode> = {
    'Command Center': <CommandCenter onNavigate={setActive} />,
    Bookings: <Bookings />,
    Extensions: <Extensions />,
    'Guest Messaging': <GuestMessaging />,
    Notifications: <Notifications />,
    Revenue: <Revenue />,
    'Extension Revenue': <ExtensionRevenue />,
    Forecasting: <Forecasting />,
    Reports: <Reports />,
    'Dynamic Pricing': <DynamicPricing />,
    Promotions: <Promotions />,
    Occupancy: <Occupancy />,
    'Customer Insights': <CustomerInsights />,
    'Extension Demand': <ExtensionDemand />,
    Cancellations: <Cancellations />,
    'AI Assistant': <AiAssistant onNavigate={setActive} />,
    'Performance Score': <PerformanceScore />,
    Availability: <Availability />,
    'Property Experience': <PropertyExperience />,
    Reviews: <Reviews />,
    'Rules & Policies': <RulesPolicies />,
    Payouts: <Payouts />,
    Properties: <Properties />,
    'Audit Log': <AuditLog />,
    Support: <Support />,
    Settings: <Settings />
  };

  return (
    <div className="flex h-screen w-full flex-col bg-canvas text-ink">
      <AppTopBar
        activeProperty={propertyId}
        onPropertyChange={setPropertyId}
        onNavigate={setActive} />
      
      <div className="flex min-h-0 flex-1">
        <Sidebar active={active} onSelect={setActive} />
        {pages[active] ?? <CommandCenter onNavigate={setActive} />}
      </div>
      <SessionTimeoutDialog />
    </div>);

}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </ThemeProvider>);

}