import React from 'react';
import { motion } from 'framer-motion';
import {
  BedDoubleIcon,
  BuildingIcon,
  CalendarCheckIcon,
  LineChartIcon,
  HeadsetIcon,
  MegaphoneIcon,
  UsersIcon } from
'lucide-react';
import { securityFeatures } from '../../data/roles';

const nodes = [
{ label: 'Hotels', icon: BuildingIcon, angle: -90 },
{ label: 'Guests', icon: UsersIcon, angle: -30 },
{ label: 'Bookings', icon: CalendarCheckIcon, angle: 30 },
{ label: 'Revenue', icon: LineChartIcon, angle: 90 },
{ label: 'Support', icon: HeadsetIcon, angle: 150 },
{ label: 'Campaigns', icon: MegaphoneIcon, angle: 210 }];


const RADIUS = 38;

function position(angle: number) {
  const radians = angle * Math.PI / 180;
  return {
    left: `${50 + RADIUS * Math.cos(radians)}%`,
    top: `${50 + RADIUS * Math.sin(radians)}%`
  };
}

export function ControlCenterHero() {
  return (
    <section
      aria-label="Checkdin admin control center"
      className="relative hidden overflow-hidden bg-[#0D0E10] lg:flex lg:flex-col">
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-accent/20 blur-[120px]" />
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-[#7C3AED]/20 blur-[120px]" />
      

      <div className="relative flex flex-1 flex-col justify-between px-10 py-10 xl:px-14">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-ink">
            <BedDoubleIcon className="h-4 w-4" />
          </span>
          <p className="text-sm font-extrabold tracking-tight text-white">CHECKDIN</p>
          <span className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] font-medium text-white/70">
            Admin
          </span>
        </div>

        <div className="relative mx-auto my-10 aspect-square w-full max-w-[440px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
            {nodes.map((node) => {
              const radians = node.angle * Math.PI / 180;
              return (
                <line
                  key={node.label}
                  x1="50"
                  y1="50"
                  x2={50 + RADIUS * Math.cos(radians)}
                  y2={50 + RADIUS * Math.sin(radians)}
                  stroke="rgba(206,240,63,0.28)"
                  strokeWidth="0.35"
                  strokeDasharray="1.6 1.4" />);


            })}
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/[0.07] p-5 text-center backdrop-blur-md">
            
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Control Center</p>
            <p className="mt-2 text-base font-bold leading-snug text-white">
              CHECKDIN ADMIN
              <br />
              CONTROL CENTER
            </p>
            <p className="mt-2 text-[11px] text-white/55">5 roles · 20 modules · 1 console</p>
          </motion.div>

          {nodes.map((node, index) =>
          <motion.div
            key={node.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.24, delay: 0.08 + index * 0.05, ease: [0.23, 1, 0.32, 1] }}
            style={position(node.angle)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 backdrop-blur-md">
            
              <node.icon className="h-3.5 w-3.5 text-accent" />
              <span className="text-[12px] font-medium text-white">{node.label}</span>
            </motion.div>
          )}
        </div>

        <div>
          <h2 className="max-w-md text-[28px] font-bold leading-tight tracking-tight text-white xl:text-[32px]">
            One platform. Multiple roles. Complete control.
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/60">
            Hotels, guests, bookings, revenue, support, and campaigns — every surface of Checkdin, governed from a
            single console.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {securityFeatures.map((feature) =>
            <li
              key={feature.label}
              className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-white/70 backdrop-blur-md">
              
                {feature.label}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}