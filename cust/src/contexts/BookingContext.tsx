import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  BookingDraft,
  GuestDetails,
  SearchState } from
'../types/booking';
import { todayIso } from '../utils/format';
import { createBooking as apiCreateBooking } from '../api/bookings';

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
  submitBooking: (data: BookingDraft) => Promise<{ id: string; reference: string }>;
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

  const submitBooking = useCallback(async (data: BookingDraft) => {
    const result = await apiCreateBooking({
      hotel_id: data.hotelId,
      date: data.date,
      check_in: data.checkIn,
      duration: data.duration,
      guests: data.guests,
    });
    setReference(result.reference);
    return result;
  }, []);

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
      setCheckInOtp,
      submitBooking,
    }),
    [search, draft, guest, reference, checkInOtp, submitBooking]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>);

}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
