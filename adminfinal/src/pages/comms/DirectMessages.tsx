import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/Field';
import { Avatar } from '../../components/ui/Primitives';
import { ChatPane } from '../../components/comms/ChatPane';
import { directThreads, people, personById } from '../../data/communications';
import { useComms, useCurrentPerson } from '../../contexts/CommsContext';
import { cn } from '../../utils/cn';

const presenceLabel = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline'
};

const presenceDot = {
  online: 'bg-positive',
  away: 'bg-warning',
  offline: 'bg-muted'
};

export function DirectMessages() {
  const me = useCurrentPerson();
  const { directMessages, sendMessage, toggleReaction, markRead, unreadByThread } = useComms();
  const [query, setQuery] = useState('');

  const threads = useMemo(
    () =>
    directThreads.
    filter((thread) => thread.personId !== me.id).
    filter((thread) => {
      if (!query) return true;
      const person = personById(thread.personId);
      return (
        person?.name.toLowerCase().includes(query.toLowerCase()) ||
        person?.department.toLowerCase().includes(query.toLowerCase()));

    }),
    [me.id, query]
  );

  const [activeId, setActiveId] = useState(threads[0]?.id ?? '');

  useEffect(() => {
    if (!threads.some((thread) => thread.id === activeId)) setActiveId(threads[0]?.id ?? '');
  }, [threads, activeId]);

  useEffect(() => {
    if (activeId) markRead(activeId);
  }, [activeId, markRead]);

  const activeThread = threads.find((thread) => thread.id === activeId);
  const peer = activeThread ? personById(activeThread.personId) : undefined;
  const threadMessages = directMessages.filter((message) => message.threadId === activeId);

  return (
    <div>
      <PageHeader
        title="Direct messages"
        subtitle="Private one-to-one threads across departments, with read receipts and presence." />
      

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <div className="border-b border-line px-4 py-3">
            <SearchInput
              placeholder="Search people or department…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search direct messages" />
            
          </div>
          <ul className="max-h-[560px] overflow-y-auto p-2">
            {threads.map((thread) => {
              const person = personById(thread.personId);
              if (!person) return null;
              const unread = unreadByThread[thread.id] ?? 0;
              return (
                <li key={thread.id}>
                  <button
                    onClick={() => setActiveId(thread.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-smooth',
                      thread.id === activeId ? 'bg-accent/20' : 'hover:bg-faint'
                    )}>
                    
                    <span className="relative">
                      <Avatar name={person.name} size="sm" />
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card',
                          presenceDot[person.presence]
                        )} />
                      
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ink">{person.name}</span>
                      <span className="block truncate text-[11px] text-muted">{person.department}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[11px] text-muted">{thread.lastAt}</span>
                      {unread ?
                      <span className="mt-0.5 inline-block rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-accent-ink">
                          {unread}
                        </span> :
                      null}
                    </span>
                  </button>
                </li>);

            })}
          </ul>
        </Card>

        <Card className="flex h-[calc(100vh-260px)] min-h-[520px] flex-col">
          {peer ?
          <>
              <header className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
                <Avatar name={peer.name} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold tracking-tight text-ink">{peer.name}</h2>
                  <p className="text-[13px] text-muted">
                    {peer.title} · {peer.department}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-[13px] text-muted">
                  <span className={cn('h-2 w-2 rounded-full', presenceDot[peer.presence])} />
                  {presenceLabel[peer.presence]}
                  {peer.presence !== 'online' ? ` · ${peer.lastSeen}` : ''}
                </span>
              </header>

              <ChatPane
              messages={threadMessages}
              peerName={peer.name?.split(' ')[0] ?? 'Guest'}
              placeholder={`Message ${peer.name?.split(' ')[0] ?? 'Guest'}…`}
              onSend={(body, priority, attachmentName) =>
              sendMessage({ threadId: activeId, body, priority, attachmentName }, true)
              }
              onReact={(messageId, emoji) => toggleReaction(messageId, emoji, true)} />
            
            </> :

          <p className="px-5 py-16 text-center text-[13px] text-muted">
              No conversations match that search. {people.length} admins are reachable.
            </p>
          }
        </Card>
      </div>
    </div>);

}
