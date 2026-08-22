import React from 'react';
import { TopBar } from '../components/TopBar';
import { StatCards } from '../components/StatCards';
import { RevenueTrendCard } from '../components/RevenueTrendCard';
import { DurationBreakdown } from '../components/DurationBreakdown';
import { RecentBookingsTable } from '../components/RecentBookingsTable';
import { RevenueOverview } from '../components/RevenueOverview';
import { TodaysBookings } from '../components/TodaysBookings';
import { RoomStatus } from '../components/RoomStatus';
import { QuickActions } from '../components/QuickActions';

export function Dashboard() {
  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <TopBar />

      <div className="mt-6 space-y-5">
        <StatCards />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <RevenueTrendCard />
              <DurationBreakdown />
            </div>
            <RecentBookingsTable />
            <RevenueOverview />
          </div>

          <div className="space-y-5">
            <TodaysBookings />
            <RoomStatus />
            <QuickActions />
          </div>
        </div>
      </div>
    </main>);

}