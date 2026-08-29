import React from "react";
import { AirVentIcon, DropletsIcon, LaptopIcon, ShirtIcon, TvIcon, WifiIcon, BoxIcon } from "lucide-react";
import { SettingsCard } from "../settings/SettingsCard";
import { ChipToggleGroup } from "./ChipToggleGroup";
import { amenityOptions } from "../../data/rooms";
const icons: Record<string, BoxIcon> = {
  WiFi: WifiIcon,
  AC: AirVentIcon,
  TV: TvIcon,
  'Hot Water': DropletsIcon,
  Workspace: LaptopIcon,
  Wardrobe: ShirtIcon
};
type RoomAmenitiesProps = {
  selected: string[];
  onToggle: (amenity: string) => void;
};
export function RoomAmenities({
  selected,
  onToggle
}: RoomAmenitiesProps) {
  return <SettingsCard title="Amenities" description="Available inside this room." action={<span className="rounded-md bg-neutral-100 px-2.5 py-1 text-[11.5px] font-semibold text-ink-muted">
          {selected.length} / {amenityOptions.length}
        </span>}>
      <ChipToggleGroup options={amenityOptions} icons={icons} selected={selected} onToggle={onToggle} columns="sm:grid-cols-2" />
    </SettingsCard>;
}