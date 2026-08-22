import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  announcements as seedAnnouncements,
  channelMessages as seedChannelMessages,
  channels,
  directMessages as seedDirectMessages,
  directThreads as seedThreads,
  internalRequests as seedRequests,
  personByRole,
  type Announcement,
  type ChatMessage,
  type Department,
  type InternalRequest,
  type Priority,
  type RequestStatus } from
'../data/communications';
import { useAuth } from './AuthContext';

interface SendPayload {
  threadId: string;
  body: string;
  priority?: Priority;
  attachmentName?: string;
}

interface NewRequestPayload {
  subject: string;
  to: Department;
  priority: Priority;
  bookingId?: string;
  message: string;
}

interface CommsContextValue {
  messages: ChatMessage[];
  directMessages: ChatMessage[];
  requests: InternalRequest[];
  announcements: Announcement[];
  unreadByThread: Record<string, number>;
  dismissedAnnouncements: string[];
  counts: {unread: number;pendingRequests: number;urgent: number;announcements: number;};
  sendMessage: (payload: SendPayload, direct?: boolean) => void;
  toggleReaction: (messageId: string, emoji: string, direct?: boolean) => void;
  markRead: (threadId: string) => void;
  createRequest: (payload: NewRequestPayload) => void;
  setRequestStatus: (id: string, status: RequestStatus, note: string) => void;
  postAnnouncement: (payload: {title: string;body: string;category: Announcement['category'];priority: Priority;audience: string;}) => void;
  dismissAnnouncement: (id: string) => void;
}

const CommsContext = createContext<CommsContextValue | null>(null);

function attachmentFor(name?: string): ChatMessage['attachments'] {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  const kind: 'pdf' | 'excel' | 'image' | 'doc' = lower.endsWith('.pdf') ?
  'pdf' :
  lower.endsWith('.xlsx') || lower.endsWith('.csv') ?
  'excel' :
  lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') ?
  'image' :
  'doc';
  return [{ name, kind, size: '—' }];
}

function nowLabel(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function CommsProvider({ children }: {children: React.ReactNode;}) {
  const { user } = useAuth();
  const me = personByRole(user?.roleId ?? 'super');

  const [messages, setMessages] = useState<ChatMessage[]>(seedChannelMessages);
  const [directMessages, setDirectMessages] = useState<ChatMessage[]>(seedDirectMessages);
  const [requests, setRequests] = useState<InternalRequest[]>(seedRequests);
  const [announcementList, setAnnouncementList] = useState<Announcement[]>(seedAnnouncements);
  const [dismissedAnnouncements, setDismissed] = useState<string[]>([]);
  const [unreadByThread, setUnread] = useState<Record<string, number>>(() => {
    const base: Record<string, number> = {};
    channels.forEach((channel) => {
      base[channel.id] = channel.unread;
    });
    seedThreads.forEach((thread) => {
      base[thread.id] = thread.unread;
    });
    return base;
  });

  const sendMessage = useCallback(
    ({ threadId, body, priority, attachmentName }: SendPayload, direct = false) => {
      const message: ChatMessage = {
        id: `LOCAL-${Date.now()}`,
        threadId,
        authorId: me.id,
        body,
        at: `Today, ${nowLabel()}`,
        priority,
        attachments: attachmentFor(attachmentName),
        reactions: [],
        readBy: []
      };
      const setter = direct ? setDirectMessages : setMessages;
      setter((prev) => [...prev, message]);
    },
    [me.id]
  );

  const toggleReaction = useCallback(
    (messageId: string, emoji: string, direct = false) => {
      const setter = direct ? setDirectMessages : setMessages;
      setter((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) return message;
        const existing = message.reactions.find((reaction) => reaction.emoji === emoji);
        if (!existing) return { ...message, reactions: [...message.reactions, { emoji, by: [me.id] }] };
        const mine = existing.by.includes(me.id);
        const nextBy = mine ? existing.by.filter((id) => id !== me.id) : [...existing.by, me.id];
        return {
          ...message,
          reactions: message.reactions.
          map((reaction) => reaction.emoji === emoji ? { ...reaction, by: nextBy } : reaction).
          filter((reaction) => reaction.by.length > 0)
        };
      })
      );
    },
    [me.id]
  );

  const markRead = useCallback((threadId: string) => {
    setUnread((prev) => prev[threadId] ? { ...prev, [threadId]: 0 } : prev);
  }, []);

  const createRequest = useCallback(
    ({ subject, to, priority, bookingId, message }: NewRequestPayload) => {
      const request: InternalRequest = {
        id: `REQ-${Date.now()}`,
        ref: `INT/2026/08/${Math.floor(42 + Math.random() * 40)}`,
        subject,
        from: me.department,
        to,
        requesterId: me.id,
        assigneeId: null,
        priority,
        status: 'Pending',
        bookingId: bookingId || undefined,
        message,
        at: `Today, ${nowLabel()}`,
        updates: [{ at: `Today, ${nowLabel()}`, by: me.name, note: 'Request raised.', status: 'Pending' }]
      };
      setRequests((prev) => [request, ...prev]);
    },
    [me]
  );

  const setRequestStatus = useCallback(
    (id: string, status: RequestStatus, note: string) => {
      setRequests((prev) =>
      prev.map((request) =>
      request.id === id ?
      {
        ...request,
        status,
        assigneeId: request.assigneeId ?? me.id,
        updates: [
        ...request.updates,
        { at: `Today, ${nowLabel()}`, by: me.name, note: note || `Marked ${status}.`, status }]

      } :
      request
      )
      );
    },
    [me]
  );

  const postAnnouncement = useCallback<CommsContextValue['postAnnouncement']>(
    ({ title, body, category, priority, audience }) => {
      setAnnouncementList((prev) => [
      {
        id: `ANN-${Date.now()}`,
        title,
        body,
        category,
        audience,
        priority,
        postedBy: me.id,
        at: `Today, ${nowLabel()}`,
        pinned: true
      },
      ...prev.map((item) => ({ ...item, pinned: false }))]
      );
    },
    [me.id]
  );

  const dismissAnnouncement = useCallback((id: string) => {
    setDismissed((prev) => [...prev, id]);
  }, []);

  const value = useMemo<CommsContextValue>(() => {
    const unread = Object.values(unreadByThread).reduce((sum, count) => sum + count, 0);
    const pendingRequests = requests.filter((request) => request.status === 'Pending' || request.status === 'In Review').length;
    const urgent = requests.filter((request) => request.priority === 'Urgent' && request.status !== 'Completed').length;
    return {
      messages,
      directMessages,
      requests,
      announcements: announcementList,
      unreadByThread,
      dismissedAnnouncements,
      counts: {
        unread,
        pendingRequests,
        urgent,
        announcements: announcementList.filter((item) => !dismissedAnnouncements.includes(item.id) && item.pinned).length
      },
      sendMessage,
      toggleReaction,
      markRead,
      createRequest,
      setRequestStatus,
      postAnnouncement,
      dismissAnnouncement
    };
  }, [
  messages,
  directMessages,
  requests,
  announcementList,
  unreadByThread,
  dismissedAnnouncements,
  sendMessage,
  toggleReaction,
  markRead,
  createRequest,
  setRequestStatus,
  postAnnouncement,
  dismissAnnouncement]
  );

  return <CommsContext.Provider value={value}>{children}</CommsContext.Provider>;
}

export function useComms(): CommsContextValue {
  const context = useContext(CommsContext);
  if (!context) throw new Error('useComms must be used inside CommsProvider');
  return context;
}

export function useCurrentPerson() {
  const { user } = useAuth();
  return personByRole(user?.roleId ?? 'super');
}