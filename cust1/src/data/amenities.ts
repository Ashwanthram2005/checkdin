import {
  AirVentIcon,
  ArrowUpDownIcon,
  BatteryChargingIcon,
  BellIcon,
  CarIcon,
  ClockIcon,
  CoffeeIcon,
  DumbbellIcon,
  FlameIcon,
  GlassWaterIcon,
  LuggageIcon,
  ShieldCheckIcon,
  ShirtIcon,
  SofaIcon,
  SparklesIcon,
  TvIcon,
  UtensilsIcon,
  WifiIcon } from
'lucide-react';

import type { ComponentType } from 'react';

export type AmenityIcon = ComponentType<{className?: string;}>;

/** Every property on Checkdin carries this baseline list. */
export const standardAmenities: {label: string;icon: AmenityIcon;}[] = [
{ label: 'Car Parking', icon: CarIcon },
{ label: 'Air Conditioner', icon: AirVentIcon },
{ label: 'Water', icon: GlassWaterIcon },
{ label: 'Hot Water Geyser', icon: FlameIcon },
{ label: 'TV', icon: TvIcon },
{ label: 'Wifi Based Internet', icon: WifiIcon },
{ label: 'Power Backup', icon: BatteryChargingIcon },
{ label: 'Dining Area', icon: UtensilsIcon },
{ label: 'Laundry Service', icon: ShirtIcon },
{ label: 'CCTV Security', icon: ShieldCheckIcon },
{ label: 'Room Service', icon: BellIcon },
{ label: 'Gym Access', icon: DumbbellIcon },
{ label: 'Coffee & Tea', icon: CoffeeIcon },
{ label: 'Lounge', icon: SofaIcon },
{ label: 'Lift', icon: ArrowUpDownIcon },
{ label: '24x7 Reception', icon: ClockIcon },
{ label: 'Luggage Storage', icon: LuggageIcon },
{ label: 'Daily Housekeeping', icon: SparklesIcon }];


export const specialFacilities: {label: string;body: string;icon: AmenityIcon;}[] = [
{
  label: 'Restaurant',
  body: 'Enjoy your favourite meals',
  icon: UtensilsIcon
},
{
  label: 'Car Parking',
  body: 'Give your vehicle a stay too',
  icon: CarIcon
}];


export function iconFor(label: string): AmenityIcon {
  return standardAmenities.find((a) => a.label === label)?.icon ?? SparklesIcon;
}

/** Nearby landmarks by serviceable area — exact address is shared after booking. */
export const areaNearby: Record<string, {name: string;km: number;}[]> = {
  Porur: [
  { name: 'Porur Toll Plaza', km: 0.8 },
  { name: 'Sri Ramachandra Hospital', km: 1.4 },
  { name: 'Porur Lake', km: 2.1 },
  { name: 'Chennai Airport', km: 12.4 }],

  Virugambakkam: [
  { name: 'Arcot Road Junction', km: 0.6 },
  { name: 'Forum Vijaya Mall', km: 2.3 },
  { name: 'Virugambakkam Bus Depot', km: 0.4 },
  { name: 'Chennai Airport', km: 11.8 }],

  Valasaravakkam: [
  { name: 'Alwarthirunagar Signal', km: 0.6 },
  { name: 'Valasaravakkam Market', km: 1.2 },
  { name: 'Arcot Road', km: 1.5 },
  { name: 'Chennai Airport', km: 12.0 }],

  Mugalivakkam: [
  { name: 'Mugalivakkam Main Road', km: 0.5 },
  { name: 'Kattupakkam Border', km: 1.3 },
  { name: 'Manapakkam IT Corridor', km: 2.6 },
  { name: 'Chennai Airport', km: 9.7 }],

  Maduravoyal: [
  { name: 'Maduravoyal Junction', km: 0.5 },
  { name: 'Chennai Bypass Entry', km: 1.1 },
  { name: 'Nerkundram Signal', km: 1.8 },
  { name: 'Chennai Airport', km: 14.2 }],

  Iyyappanthangal: [
  { name: 'Kumananchavadi Signal', km: 0.7 },
  { name: 'DLF IT Park, Phase 2', km: 2.4 },
  { name: 'Poonamallee Bypass', km: 3.1 },
  { name: 'Chennai Airport', km: 15.6 }],

  Ramapuram: [
  { name: 'DLF IT Park', km: 0.6 },
  { name: 'Ramapuram Bus Terminus', km: 1.0 },
  { name: 'Mount Poonamallee Road', km: 1.4 },
  { name: 'Chennai Airport', km: 8.9 }]

};