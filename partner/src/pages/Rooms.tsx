import React, { useState } from 'react';
import { CheckCircle2Icon, InfoIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RoomPhotos } from '../components/rooms/RoomPhotos';
import { RoomAmenities } from '../components/rooms/RoomAmenities';
import { RoomFacilities } from '../components/rooms/RoomFacilities';
import { RoomCapacity } from '../components/rooms/RoomCapacity';
import { RoomDescription } from '../components/rooms/RoomDescription';
import { AvailabilityStatusCard } from '../components/rooms/AvailabilityStatusCard';
import { PermissionNotice } from '../components/AccessControls';
import { useAuth } from '../contexts/AuthContext';
import { roomProfile, type RoomProfile } from '../data/rooms';

export function Rooms() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_rooms');
  const [profile, setProfile] = useState<RoomProfile>(roomProfile);
  const [saved, setSaved] = useState(false);
  const photosMissing = profile.photos.filter((photo) => !photo.url).length;

  const patch = (changes: Partial<RoomProfile>) => {
    setSaved(false);
    setProfile((prev) => ({ ...prev, ...changes }));
  };

  const toggleIn = (key: 'amenities' | 'facilities', value: string) =>
  patch({
    [key]: profile[key].includes(value) ?
    profile[key].filter((item) => item !== value) :
    [...profile[key], value]
  } as Partial<RoomProfile>);

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Rooms"
        subtitle="One room standard for every hourly booking — photos, amenities, capacity and status." />
      

      <div className="mt-6 space-y-5 pb-28">
        <p className="flex items-start gap-2.5 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-[13px] text-ink-soft shadow-card">
          <InfoIcon size={16} className="mt-0.5 shrink-0 text-lime-600" aria-hidden="true" />
          <span>
            Checkdin sells hourly slots, not room categories. Guests book a slot and reception
            assigns any allocated room, so this setup describes what every Checkdin guest can expect.
            Set how many rooms you allocate in <span className="font-semibold text-ink">Availability</span>.
          </span>
        </p>

        <RoomPhotos photos={profile.photos} onChange={(photos) => patch({ photos })} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RoomAmenities
            selected={profile.amenities}
            onToggle={(amenity) => toggleIn('amenities', amenity)} />
          
          <RoomFacilities
            selected={profile.facilities}
            onToggle={(facility) => toggleIn('facilities', facility)} />
          
        </div>

        <RoomCapacity capacity={profile.capacity} onChange={(capacity) => patch({ capacity })} />
        <RoomDescription
          description={profile.description}
          onChange={(description) => patch({ description })} />
        
        <AvailabilityStatusCard
          value={profile.availability}
          onChange={(availability) => patch({ availability })} />
        
      </div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            {photosMissing > 0 ?
            `${photosMissing} required photo${photosMissing === 1 ? '' : 's'} missing — upload them to publish.` :
            'Applies to every room you allocate to Checkdin at this property.'}
          </p>
          <div className="flex items-center gap-3">
            {saved &&
            <p
              role="status"
              className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
              
                <CheckCircle2Icon size={15} aria-hidden="true" />
                Room details saved
              </p>
            }
            <button
              type="button"
              onClick={() => {
                setProfile(roomProfile);
                setSaved(false);
              }}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-[13.5px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
              
              Discard
            </button>
            {canManage ?
            <button
              type="button"
              disabled={photosMissing > 0}
              title={photosMissing > 0 ? 'Upload all required room photos first' : undefined}
              onClick={() => {
                setSaved(true);
                addAudit({
                  action: 'Updated room setup',
                  detail: `${profile.availability} • ${profile.photos.length - photosMissing} photos • ${profile.amenities.length} amenities`,
                  category: 'Operations'
                });
              }}
              className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-ink-muted">
              
                Save Changes
              </button> :

            <PermissionNotice label="Manage rooms permission required" />
            }
          </div>
        </div>
      </div>
    </main>);

}