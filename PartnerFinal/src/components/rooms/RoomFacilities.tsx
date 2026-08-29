import React from "react";
import { ArrowUpDownIcon, CarIcon, ConciergeBellIcon, HandPlatterIcon, ShieldCheckIcon, UtensilsIcon, BoxIcon } from "lucide-react";
import { SettingsCard } from "../settings/SettingsCard";
import { ChipToggleGroup } from "./ChipToggleGroup";
import { facilityOptions } from "../../data/rooms";
const icons: Record<string, BoxIcon> = {
  Parking: CarIcon,
  Lift: ArrowUpDownIcon,
  Restaurant: UtensilsIcon,
  Reception: ConciergeBellIcon,
  'Room Service': HandPlatterIcon,
  Security: ShieldCheckIcon
};
type RoomFacilitiesProps = {
  selected: string[];
  onToggle: (facility: string) => void;
};
export function RoomFacilities({
  selected,
  onToggle
}: RoomFacilitiesProps) {
  return <SettingsCard title="Facilities" description="Property-level services guests of this room can use." action={<span className="rounded-md bg-neutral-100 px-2.5 py-1 text-[11.5px] font-semibold text-ink-muted">
          {selected.length} / {facilityOptions.length}
        </span>}>
      <ChipToggleGroup options={facilityOptions} icons={icons} selected={selected} onToggle={onToggle} columns="sm:grid-cols-2" />
    </SettingsCard>;
}