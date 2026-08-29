import React, { useEffect, useMemo, useState } from 'react';
import { HashIcon, LockIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/Field';
import { Badge } from '../../components/ui/Badge';
import { ChatPane } from '../../components/comms/ChatPane';
import { EmptyState } from '../../components/ui/Primitives';
import { channels } from '../../data/communications';
import { useComms } from '../../contexts/CommsContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

export function DepartmentChat() {
  const { user } = useAuth();
  const { messages, sendMessage, toggleReaction, markRead, unreadByThread } = useComms();
  const roleId = user?.roleId ?? 'super';

  const visible = useMemo(() => channels.filter((channel) => channel.roles.includes(roleId)), [roleId]);
  const [activeId, setActiveId] = useState(visible[0]?.id ?? 'general');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!visible.some((channel) => channel.id === activeId)) setActiveId(visible[0]?.id ?? 'general');
  }, [visible, activeId]);

  useEffect(() => {
    markRead(activeId);
  }, [activeId, markRead]);

  const active = visible.find((channel) => channel.id === activeId) ?? visible[0];

  const threadMessages = messages.
  filter((message) => message.threadId === activeId).
  filter((message) => query ? message.body.toLowerCase().includes(query.toLowerCase()) : true);

  if (!active) {
    return (
      <Card>
        <EmptyState
          icon={LockIcon}
          title="No channels for your role"
          description="Your role does not have access to any department channels yet." />
        
      </Card>);

  }

  return (
    <div>
      <PageHeader
        title="Department chat"
        subtitle="Channels scoped to your role — conversations stay inside Checkdin, not WhatsApp." />
      

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <p className="border-b border-line px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Channels · {visible.length}
          </p>
          <ul className="p-2">
            {visible.map((channel) => {
              const unread = unreadByThread[channel.id] ?? 0;
              const isActive = channel.id === activeId;
              return (
                <li key={channel.id}>
                  <button
                    onClick={() => setActiveId(channel.id)}
                    className={cn(
                      'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-smooth',
                      isActive ? 'bg-accent/20' : 'hover:bg-faint'
                    )}>
                    
                    {channel.id === 'management' ?
                    <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" /> :

                    <HashIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                    }
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ink">{channel.name}</span>
                      <span className="block truncate text-[11px] text-muted">{channel.purpose}</span>
                    </span>
                    {unread ?
                    <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-accent-ink">
                        {unread}
                      </span> :
                    null}
                  </button>
                </li>);

            })}
          </ul>
        </Card>

        <Card className="flex h-[calc(100vh-260px)] min-h-[520px] flex-col">
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-ink">
                <HashIcon className="h-4 w-4 text-muted" />
                {active.name}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">{active.purpose}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {active.topics.map((topic) =>
                <li key={topic}>
                    <Badge tone="neutral">{topic}</Badge>
                  </li>
                )}
              </ul>
            </div>
            <SearchInput
              className="w-full sm:w-56"
              placeholder="Search this channel…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search messages in channel" />
            
          </header>

          <ChatPane
            messages={threadMessages}
            placeholder={`Message #${active.name.toLowerCase().replace(/\s+/g, '-')} — use @Finance, @Operations to pull people in`}
            emptyLabel={query ? 'No messages match that search.' : 'No messages yet — start the thread.'}
            onSend={(body, priority, attachmentName) =>
            sendMessage({ threadId: active.id, body, priority, attachmentName })
            }
            onReact={(messageId, emoji) => toggleReaction(messageId, emoji)} />
          
        </Card>
      </div>
    </div>);

}