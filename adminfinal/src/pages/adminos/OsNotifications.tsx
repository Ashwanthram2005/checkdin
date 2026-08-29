import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArchiveIcon, BellIcon, CheckCheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/Primitives';
import { MetricTile } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { cn } from '../../utils/cn';

const tabs = ['Unread', 'All', 'Archived'];
const channels = ['All channels', 'Customer', 'Partner', 'Internal', 'Finance'];

export function OsNotifications() {
  const { state, run } = useAdminOs();
  const [tab, setTab] = useState('Unread');
  const [channel, setChannel] = useState('All channels');
  const [query, setQuery] = useState('');

  const counts = useMemo(
    () => ({
      Unread: state.notifications.filter((row) => !row.read && !row.archived).length,
      All: state.notifications.filter((row) => !row.archived).length,
      Archived: state.notifications.filter((row) => row.archived).length
    }),
    [state.notifications]
  );

  const rows = useMemo(
    () =>
    state.notifications.filter((row) => {
      if (tab === 'Unread' && (row.read || row.archived)) return false;
      if (tab === 'All' && row.archived) return false;
      if (tab === 'Archived' && !row.archived) return false;
      if (channel !== 'All channels' && row.channel !== channel) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return row.title.toLowerCase().includes(needle) || row.detail.toLowerCase().includes(needle);
    }),
    [state.notifications, tab, channel, query]
  );

  return (
    <div>
      <PageHeader
        title="AdminOS notifications"
        subtitle="Every message the platform sent to guests, partners, finance, and internal teams as a result of an admin action."
        actions={
        <Button
          icon={CheckCheckIcon}
          onClick={() => run({ type: 'notification.readAll' }, { success: 'All notifications marked read' })}
          disabled={counts.Unread === 0}>
          
            Mark all read
          </Button>
        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Unread" value={String(counts.Unread)} hint="needs attention" tone={counts.Unread ? 'accent' : 'default'} />
        <MetricTile label="Sent to guests" value={String(state.notifications.filter((row) => row.channel === 'Customer').length)} hint="extension, refund, dispute outcomes" />
        <MetricTile label="Sent to partners" value={String(state.notifications.filter((row) => row.channel === 'Partner').length)} hint="visibility, payout, compliance" />
        <MetricTile label="Archived" value={String(counts.Archived)} hint="cleared from the inbox" />
      </div>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search notifications…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search notifications" />
          
          <div className="sm:ml-auto">
            <Select options={channels} value={channel} onChange={(event) => setChannel(event.target.value)} aria-label="Filter by channel" />
          </div>
        </Toolbar>

        {rows.length === 0 ?
        <EmptyState
          icon={BellIcon}
          title={tab === 'Unread' ? 'Nothing unread' : 'No notifications here'}
          description="Notifications are created automatically whenever an AdminOS action affects a guest, partner, or internal team." /> :


        <ul className="divide-y divide-line">
            {rows.map((notification) =>
          <li
            key={notification.id}
            className={cn('flex flex-wrap items-start gap-3 px-5 py-4', !notification.read && 'bg-accent/[0.05]')}>
            
                <span
              className={cn(
                'mt-1 h-2 w-2 shrink-0 rounded-full',
                notification.read ? 'bg-line' : 'bg-accent'
              )} />
            
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold text-ink">{notification.title}</p>
                    <Badge tone="neutral">{notification.channel}</Badge>
                    <span className="ml-auto text-[11px] text-muted">{notification.at}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{notification.detail}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {notification.link ?
                <Link to={notification.link}>
                        <Button size="sm" variant="primary">
                          Open record
                        </Button>
                      </Link> :
                null}
                    <Button
                  size="sm"
                  icon={notification.read ? EyeOffIcon : EyeIcon}
                  onClick={() =>
                  run(
                    { type: 'notification.read', id: notification.id, read: !notification.read },
                    { success: notification.read ? 'Marked unread' : 'Marked read' }
                  )
                  }>
                  
                      Mark {notification.read ? 'unread' : 'read'}
                    </Button>
                    {!notification.archived ?
                <Button
                  size="sm"
                  icon={ArchiveIcon}
                  onClick={() => run({ type: 'notification.archive', id: notification.id }, { success: 'Archived' })}>
                  
                        Archive
                      </Button> :
                null}
                  </div>
                </div>
              </li>
          )}
          </ul>
        }
      </Card>
    </div>);

}