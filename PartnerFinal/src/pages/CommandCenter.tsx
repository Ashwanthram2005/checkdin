import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { DecisionStrip } from '../components/command/DecisionStrip';
import { RecommendationFeed } from '../components/command/RecommendationFeed';
import { ExtensionRequestsPanel } from '../components/extensions/ExtensionRequestsPanel';
import { RevenueTrendCard } from '../components/RevenueTrendCard';
import { DurationBreakdown } from '../components/DurationBreakdown';
import { RecentBookingsTable } from '../components/RecentBookingsTable';
import { TodaysBookings } from '../components/TodaysBookings';
import { QuickActions } from '../components/QuickActions';

type CommandCenterProps = {
  onNavigate: (label: string) => void;
};

export function CommandCenter({ onNavigate }: CommandCenterProps) {
  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Command Center"
        subtitle="Run your hotel smarter — everything that needs a decision today, in one place." />
      

      <div className="mt-6 space-y-5 pb-8">
        <DecisionStrip onNavigate={onNavigate} hotelStatus="Live" />

        <ExtensionRequestsPanel />

        <RecommendationFeed onOpenAll={() => onNavigate('AI Assistant')} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <RevenueTrendCard />
              <DurationBreakdown />
            </div>
            <RecentBookingsTable />
          </div>

          <div className="space-y-5">
            <TodaysBookings />
            <QuickActions onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </main>);

}