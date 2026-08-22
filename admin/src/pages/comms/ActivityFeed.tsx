import React, { useMemo, useState } from 'react';
import {
  AtSignIcon,
  CheckCircle2Icon,
  MegaphoneIcon,
  MessageSquareIcon,
  TicketIcon } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Avatar, EmptyState } from '../../components/ui/Primitives';
import { activityFeed, personById, type ActivityItem } from '../../data/communications';

const tabs = ['All', 'Messages', 'Requests', 'Mentions', 'Announcements'];

const kindIcon: Record<ActivityItem['kind'], React.ComponentType<{className?: string;}>> = {
  message: MessageSquareIcon,
  request: TicketIcon,
  announcement: MegaphoneIcon,
  approval: CheckCircle2Icon,
  mention: AtSignIcon
};

const tabKinds: Record<string, ActivityItem['kind'][]> = {
  Messages: ['message'],
  Requests: ['request', 'approval'],
  Mentions: ['mention'],
  Announcements: ['announcement']
};

export function ActivityFeed() {
  const [tab, setTab] = useState('All');

  const rows = useMemo(
    () => tab === 'All' ? activityFeed : activityFeed.filter((item) => tabKinds[tab].includes(item.kind)),
    [tab]
  );

  return (
    <div>
      <PageHeader
        title="Activity feed"
        subtitle="Everything happening across channels, requests, and announcements — newest first." />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        {rows.length === 0 ?
        <EmptyState
          icon={MessageSquareIcon}
          title="No activity in this view"
          description="Switch filters to see messages, requests, mentions, or announcements." /> :


        <ul className="divide-y divide-line">
            {rows.map((item) => {
            const Icon = kindIcon[item.kind];
            const actor = personById(item.actorId);
            return (
              <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-faint text-muted">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-ink">
                      <span className="font-semibold">{actor?.name}</span> {item.text}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{item.context}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] text-muted">{item.at}</span>
                    <Avatar name={actor?.name ?? 'Admin'} size="sm" />
                  </div>
                </li>);

          })}
          </ul>
        }
      </Card>
    </div>);

}