import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AnnouncementBanner } from '../comms/AnnouncementBanner';

export function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-full w-full bg-canvas">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:pl-[248px]">
        <Topbar onOpenNav={() => setNavOpen(true)} />
        <AnnouncementBanner />
        <main key={pathname} className="px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>);

}