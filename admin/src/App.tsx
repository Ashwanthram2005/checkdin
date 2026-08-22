import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CommsProvider } from './contexts/CommsContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { DepartmentChat } from './pages/comms/DepartmentChat';
import { DirectMessages } from './pages/comms/DirectMessages';
import { Announcements } from './pages/comms/Announcements';
import { InternalRequests } from './pages/comms/InternalRequests';
import { ActivityFeed } from './pages/comms/ActivityFeed';
import { AdminLayout } from './components/layout/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { BookingDetail } from './pages/BookingDetail';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { Rooms } from './pages/Rooms';
import { PricingManagement } from './pages/PricingManagement';
import { Partners } from './pages/Partners';
import { PartnerDetail } from './pages/PartnerDetail';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { Revenue } from './pages/Revenue';
import { Payouts } from './pages/Payouts';
import { Refunds } from './pages/Refunds';
import { Reviews } from './pages/Reviews';
import { Support } from './pages/Support';
import { Notifications } from './pages/Notifications';
import { Coupons } from './pages/Coupons';
import { CMS } from './pages/CMS';
import { Reports } from './pages/Reports';
import { AuditLogs } from './pages/AuditLogs';
import { FraudDetection } from './pages/FraudDetection';
import { AdminUsers } from './pages/AdminUsers';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CommsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingDetail />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/pricing" element={<PricingManagement />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:id" element={<PartnerDetail />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/support" element={<Support />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/cms" element={<CMS />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/fraud" element={<FraudDetection />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/comms/channels" element={<DepartmentChat />} />
            <Route path="/comms/dms" element={<DirectMessages />} />
            <Route path="/comms/announcements" element={<Announcements />} />
            <Route path="/comms/requests" element={<InternalRequests />} />
            <Route path="/comms/activity" element={<ActivityFeed />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </CommsProvider>
      </AuthProvider>
    </ThemeProvider>);

}