import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform } from
'framer-motion';
import { CalendarIcon, ClockIcon, MapPinIcon, SearchIcon, XIcon } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { dateLabel, toTimeLabel } from '../../utils/format';
import { SearchPanel } from './SearchPanel';

/** Where the compact bar parks: below the 64px header. */
const STUCK_TOP = 76;
const COMPACT_HEIGHT = 60;
const COMPACT_MAX_WIDTH = 620;
const ease = [0.23, 1, 0.32, 1] as const;

interface Props {
  /** Spacer in the hero that reserves the bar's starting position and width. */
  anchorRef: React.RefObject<HTMLDivElement>;
  /** Natural height of the hero-sized panel, measured by the parent. */
  onMeasure: (height: number) => void;
}

export function ScrollSearchBar({ anchorRef, onMeasure }: Props) {
  const { search } = useBooking();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const panelRef = useRef<HTMLDivElement>(null);

  const [box, setBox] = useState({ top: 400, width: 1100, height: 96 });
  const [expanded, setExpanded] = useState(false);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const height = panelRef.current?.offsetHeight ?? rect.height;
    setBox((prev) => {
      const next = {
        top: rect.top + window.scrollY,
        width: rect.width,
        height: height || prev.height
      };
      return prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height ?
      prev :
      next;
    });
    if (height) onMeasure(height);
  }, [anchorRef, onMeasure]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (anchorRef.current) ro.observe(anchorRef.current);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, anchorRef]);

  useEffect(() => {
    if (!expanded) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setExpanded(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);

  const distance = Math.max(1, box.top - STUCK_TOP);
  const compactWidth = Math.min(box.width, COMPACT_MAX_WIDTH);
  const range: [number, number] = [0, distance];

  // Everything below is scroll-linked: values update on the compositor's frame,
  // never through React state, so the shrink tracks the scroll position exactly.
  const top = useTransform(scrollY, range, [box.top, STUCK_TOP], { clamp: true });
  const width = useTransform(scrollY, range, [box.width, compactWidth], {
    clamp: true
  });
  const height = useTransform(scrollY, range, [box.height, COMPACT_HEIGHT], {
    clamp: true
  });
  const radius = useTransform(scrollY, range, [16, COMPACT_HEIGHT / 2], {
    clamp: true
  });
  const shadow = useTransform(
    scrollY,
    range,
    ['0 18px 40px -20px rgba(17,17,17,0.35)', '0 10px 30px -12px rgba(17,17,17,0.25)'],
    { clamp: true }
  );
  const surfaceAlpha = useTransform(
    scrollY,
    range,
    ['rgba(255,255,255,1)', 'rgba(255,255,255,0.82)'],
    { clamp: true }
  );
  const borderAlpha = useTransform(
    scrollY,
    range,
    ['rgba(229,231,235,0)', 'rgba(229,231,235,1)'],
    { clamp: true }
  );

  // Full form: fades and scales down over the first half of the travel.
  const formOpacity = useTransform(
    scrollY,
    [0, distance * 0.5],
    [1, 0],
    { clamp: true }
  );
  const formScale = useTransform(scrollY, [0, distance], [1, 0.9], { clamp: true });
  const formPointer = useTransform(formOpacity, (v) => v > 0.6 ? 'auto' : 'none');

  // Compact pill: fades and scales up over the second half.
  const pillOpacity = useTransform(
    scrollY,
    [distance * 0.45, distance * 0.95],
    [0, 1],
    { clamp: true }
  );
  const pillScale = useTransform(
    scrollY,
    [distance * 0.45, distance],
    [0.92, 1],
    { clamp: true }
  );
  const pillPointer = useTransform(pillOpacity, (v) => v > 0.5 ? 'auto' : 'none');
  const pillFontScale = useTransform(scrollY, range, [1.06, 1], { clamp: true });
  // Let the location dropdown escape the shell while the full form is in use.
  const clip = useTransform(scrollY, (v) => v < 6 ? 'visible' : 'hidden');

  const segments: {
    icon: React.ComponentType<{className?: string;}> | null;
    value: string;
    hideOnSmall?: boolean;
  }[] = [
  { icon: MapPinIcon, value: search.location || 'Chennai' },
  { icon: CalendarIcon, value: dateLabel(search.date) },
  { icon: ClockIcon, value: toTimeLabel(search.checkIn), hideOnSmall: true },
  { icon: null, value: `${search.duration}H`, hideOnSmall: true }];


  return (
    <>
      <motion.div
        style={{
          top,
          width,
          height,
          borderRadius: radius,
          backgroundColor: surfaceAlpha,
          borderColor: borderAlpha,
          boxShadow: shadow,
          overflow: clip
        }}
        className="fixed left-1/2 z-30 -translate-x-1/2 border backdrop-blur-md">
        
        {/* Hero-sized form */}
        <motion.div
          ref={panelRef}
          style={{
            opacity: formOpacity,
            scale: formScale,
            x: '-50%',
            pointerEvents: formPointer,
            width: box.width || undefined
          }}
          className="absolute left-1/2 top-0 origin-top">
          
          <SearchPanel variant="bare" />
        </motion.div>

        {/* Compact pill */}
        <motion.button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Edit your search"
          style={{ opacity: pillOpacity, scale: pillScale, pointerEvents: pillPointer }}
          className="absolute inset-0 flex items-center gap-1 px-3">
          
          <motion.span
            style={{ scale: pillFontScale }}
            className="flex min-w-0 flex-1 items-center justify-center gap-1">
            
            {segments.map((segment, i) =>
            <React.Fragment key={segment.value + i}>
                {i > 0 &&
              <span
                className={`h-4 w-px shrink-0 bg-line ${
                segment.hideOnSmall ? 'hidden sm:block' : ''}`
                }
                aria-hidden="true" />

              }
                <span
                className={`flex min-w-0 items-center gap-1.5 px-2 text-sm font-bold text-ink ${
                segment.hideOnSmall ? 'hidden sm:flex' : ''}`
                }>
                
                  {segment.icon &&
                <segment.icon
                  className="h-3.5 w-3.5 shrink-0 text-muted"
                  aria-hidden="true" />

                }
                  <span className="truncate">{segment.value}</span>
                </span>
              </React.Fragment>
            )}
          </motion.span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-ink">
            <SearchIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        </motion.button>
      </motion.div>

      {/* Expanded editor — stays centered, opens under the pill */}
      <AnimatePresence>
        {expanded &&
        <>
            <motion.button
            key="backdrop"
            type="button"
            aria-label="Close search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-40 cursor-default bg-ink/40 backdrop-blur-[2px]" />
          
            <motion.div
            key="editor"
            role="dialog"
            aria-label="Edit your search"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0 : 0.26, ease }}
            className="fixed left-1/2 top-[92px] z-50 w-[min(94vw,1000px)] -translate-x-1/2 rounded-3xl border border-line bg-surface/95 p-2 shadow-lift backdrop-blur-md">
            
              <div className="flex items-center justify-between px-3 pb-1 pt-2">
                <h2 className="text-sm font-bold">Edit your search</h2>
                <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close"
                className="rounded-lg border border-line p-1.5 transition-colors duration-150 ease-smooth hover:border-ink">
                
                  <XIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <SearchPanel
              idPrefix="sticky"
              variant="compact"
              onSubmitted={() => {
                setExpanded(false);
                navigate('/search');
              }} />
            
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}