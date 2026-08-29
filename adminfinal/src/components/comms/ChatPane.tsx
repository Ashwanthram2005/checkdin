import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCheckIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  PaperclipIcon,
  SendIcon,
  SmilePlusIcon } from
'lucide-react';
import { Avatar } from '../ui/Primitives';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Field';
import { REACTIONS, mentionTokens, personById, type ChatMessage, type Priority } from '../../data/communications';
import { useCurrentPerson } from '../../contexts/CommsContext';
import { cn } from '../../utils/cn';

const attachmentIcons = {
  pdf: FileTextIcon,
  excel: FileSpreadsheetIcon,
  image: ImageIcon,
  doc: FileTextIcon
};

const priorityTone: Record<Priority, 'neutral' | 'info' | 'warning' | 'negative'> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Urgent: 'negative'
};

function MessageBody({ body }: {body: string;}) {
  const parts = body.split(/(@[A-Za-z]+)/g);
  return (
    <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
      {parts.map((part, index) =>
      part.startsWith('@') ?
      <span key={index} className="rounded bg-accent/30 px-1 font-semibold text-ink">
            {part}
          </span> :

      <React.Fragment key={index}>{part}</React.Fragment>

      )}
    </p>);

}

export function ChatPane({
  messages,
  onSend,
  onReact,
  placeholder,
  emptyLabel = 'No messages yet — start the thread.',
  peerName







}: {messages: ChatMessage[];onSend: (body: string, priority: Priority | undefined, attachmentName?: string) => void;onReact: (messageId: string, emoji: string) => void;placeholder: string;emptyLabel?: string;peerName?: string;}) {
  const me = useCurrentPerson();
  const [draft, setDraft] = useState('');
  const [priority, setPriority] = useState('No priority');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [reactingTo, setReactingTo] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lastId = messages[messages.length - 1]?.id;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lastId]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.authorId !== me.id || !peerName) return;
    setTyping(true);
    const id = window.setTimeout(() => setTyping(false), 2600);
    return () => window.clearTimeout(id);
  }, [lastId, me.id, peerName, messages]);

  const grouped = useMemo(() => messages, [messages]);

  function submit() {
    if (!draft.trim()) return;
    onSend(draft.trim(), priority === 'No priority' ? undefined : priority as Priority, attachment ?? undefined);
    setDraft('');
    setAttachment(null);
    setPriority('No priority');
  }

  function insertMention(token: string) {
    setDraft((prev) => `${prev}${prev.endsWith(' ') || prev === '' ? '' : ' '}${token} `);
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {grouped.length === 0 ?
        <p className="py-16 text-center text-[13px] text-muted">{emptyLabel}</p> :

        grouped.map((message) => {
          const author = personById(message.authorId);
          const mine = message.authorId === me.id;
          return (
            <article key={message.id} className="group flex gap-3">
                <Avatar name={author?.name ?? 'Admin'} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink">{author?.name ?? 'Admin'}</span>
                    <span className="text-[11px] text-muted">{author?.title}</span>
                    <span className="text-[11px] text-muted">· {message.at}</span>
                    {message.priority ?
                  <Badge tone={priorityTone[message.priority]}>{message.priority}</Badge> :
                  null}
                  </div>

                  <MessageBody body={message.body} />

                  {message.attachments?.length ?
                <ul className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((file) => {
                    const Icon = attachmentIcons[file.kind];
                    return (
                      <li key={file.name}>
                            <button className="flex items-center gap-2 rounded-lg border border-line bg-faint px-2.5 py-2 text-left transition-colors duration-150 ease-smooth hover:bg-card">
                              <Icon className="h-4 w-4 shrink-0 text-muted" />
                              <span>
                                <span className="block text-xs font-medium text-ink">{file.name}</span>
                                <span className="block text-[11px] text-muted">{file.size}</span>
                              </span>
                            </button>
                          </li>);

                  })}
                    </ul> :
                null}

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {message.reactions.map((reaction) =>
                  <button
                    key={reaction.emoji}
                    onClick={() => onReact(message.id, reaction.emoji)}
                    className={cn(
                      'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors duration-150 ease-smooth',
                      reaction.by.includes(me.id) ?
                      'border-accent bg-accent/20 text-ink' :
                      'border-line bg-card text-muted hover:bg-faint'
                    )}>
                    
                        <span>{reaction.emoji}</span>
                        <span className="tabular-nums">{reaction.by.length}</span>
                      </button>
                  )}

                    <div className="relative">
                      <button
                      aria-label="Add reaction"
                      onClick={() => setReactingTo((prev) => prev === message.id ? null : message.id)}
                      className="rounded-full border border-line bg-card p-1 text-muted opacity-0 transition-opacity duration-150 ease-smooth hover:text-ink focus-visible:opacity-100 group-hover:opacity-100">
                      
                        <SmilePlusIcon className="h-3.5 w-3.5" />
                      </button>
                      {reactingTo === message.id ?
                    <div className="absolute bottom-7 left-0 z-10 flex gap-1 rounded-lg border border-line bg-elevated px-1.5 py-1 shadow-pop">
                          {REACTIONS.map((emoji) =>
                      <button
                        key={emoji}
                        onClick={() => {
                          onReact(message.id, emoji);
                          setReactingTo(null);
                        }}
                        className="rounded px-1 text-sm transition-colors duration-150 ease-smooth hover:bg-faint">
                        
                              {emoji}
                            </button>
                      )}
                        </div> :
                    null}
                    </div>

                    {mine ?
                  <span className="ml-auto flex items-center gap-1 text-[11px] text-muted">
                        <CheckCheckIcon
                      className={cn('h-3.5 w-3.5', message.readBy.length ? 'text-info' : 'text-muted')} />
                    
                        {message.readBy.length ? `Read by ${message.readBy.length}` : 'Sent'}
                      </span> :
                  null}
                  </div>
                </div>
              </article>);

        })
        }

        {typing && peerName ?
        <p className="flex items-center gap-2 text-[12px] text-muted">
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
            </span>
            {peerName} is typing…
          </p> :
        null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line px-5 py-3.5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {mentionTokens.map((token) =>
          <button
            key={token}
            onClick={() => insertMention(token)}
            className="rounded-md border border-line bg-card px-2 py-0.5 text-[11px] font-medium text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
            
              {token}
            </button>
          )}
        </div>

        <textarea
          ref={inputRef}
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          aria-label="Message"
          className="w-full resize-none rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-accent" />
        

        {attachment ?
        <p className="mt-2 flex items-center gap-2 text-xs text-muted">
            <PaperclipIcon className="h-3.5 w-3.5" />
            {attachment}
            <button onClick={() => setAttachment(null)} className="font-medium text-negative">
              Remove
            </button>
          </p> :
        null}

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            icon={PaperclipIcon}
            onClick={() => setAttachment('checkdin-attachment.pdf')}>
            
            Attach
          </Button>
          <Select
            className="w-40"
            options={['No priority', 'Low', 'Medium', 'High', 'Urgent']}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            aria-label="Message priority" />
          
          <Button variant="primary" size="sm" icon={SendIcon} className="ml-auto" onClick={submit}>
            Send
          </Button>
        </div>
      </div>
    </div>);

}