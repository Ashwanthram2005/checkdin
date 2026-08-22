import React, { createContext, useContext, useMemo, useState } from 'react';
import type {
  BookingDraft,
  GuestDetails,
  SearchState } from
'../types/booking';
import { todayIso } from '../utils/format';

interface BookingContextValue {
  search: SearchState;
  setSearch: (next: Partial<SearchState>) => void;
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft) => void;
  guest: GuestDetails | null;
  setGuest: (guest: GuestDetails) => void;
  reference: string | null;
  setReference: (ref: string) => void;
  checkInOtp: string | null;
  setCheckInOtp: (otp: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: {children: React.ReactNode;}) {
  const [search, setSearchState] = useState<SearchState>({
    city: 'Chennai',
    location: 'Chennai',
    date: todayIso(),
    checkIn: '14:00',
    duration: 6
  });
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [guest, setGuest] = useState<GuestDetails | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [checkInOtp, setCheckInOtp] = useState<string | null>(null);

  const value = useMemo<BookingContextValue>(
    () => ({
      search,
      setSearch: (next) => setSearchState((prev) => ({ ...prev, ...next })),
      draft,
      setDraft,
      guest,
      setGuest,
      reference,
      setReference,
      checkInOtp,
      setCheckInOtp
    }),
    [search, draft, guest, reference, checkInOtp]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>);

}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}