import React from 'react';
import { AlertTriangleIcon, CheckIcon, ImagePlusIcon, StarIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { SettingsCard } from '../settings/SettingsCard';
import { ROOM_IMAGES } from '../../data/dashboard';
import type { RoomPhoto } from '../../data/rooms';

type RoomPhotosProps = {
  photos: RoomPhoto[];
  onChange: (photos: RoomPhoto[]) => void;
};

/** Stand-in for a real upload — the prototype fills the slot with a sample shot. */
const sampleUrls = [ROOM_IMAGES.deluxe, ROOM_IMAGES.suite, ROOM_IMAGES.premium];

export function RoomPhotos({ photos, onChange }: RoomPhotosProps) {
  const uploaded = photos.filter((photo) => photo.url).length;
  const missing = photos.length - uploaded;
  const complete = missing === 0;

  const setUrl = (id: RoomPhoto['id'], url: string | null) =>
  onChange(photos.map((photo) => photo.id === id ? { ...photo, url } : photo));

  const cover = photos.find((photo) => photo.id === 'cover')!;
  const rest = photos.filter((photo) => photo.id !== 'cover');

  return (
    <SettingsCard
      title="Room photos"
      description="All ten shots are required — guests see this exact set before booking a slot."
      action={
      <span
        className={[
        'rounded-md px-2.5 py-1 text-[11.5px] font-semibold',
        complete ? 'bg-lime-100 text-lime-600' : 'bg-amber-50 text-amber-700'].
        join(' ')}>
        
          {uploaded} of {photos.length} uploaded
        </span>
      }>
      
      {!complete &&
      <p className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          <AlertTriangleIcon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">{missing} photo{missing === 1 ? '' : 's'} still needed.</span>{' '}
            The room cannot be published until every required shot is uploaded.
          </span>
        </p>
      }

      <div className="flex flex-col gap-5 lg:flex-row">
        <figure className="w-full shrink-0 overflow-hidden rounded-xl border border-neutral-200 lg:w-[400px]">
          {cover.url ?
          <img src={cover.url} alt={cover.label} className="h-[236px] w-full object-cover" /> :

          <div className="flex h-[236px] w-full flex-col items-center justify-center gap-2 bg-neutral-50">
              <ImagePlusIcon size={26} className="text-neutral-400" aria-hidden="true" />
              <p className="text-[12.5px] text-ink-muted">No cover photo yet</p>
            </div>
          }
          <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-lime-600">
                <StarIcon size={11} fill="currentColor" aria-hidden="true" />
                COVER PHOTO — REQUIRED
              </span>
              <span className="mt-0.5 block text-[13px] font-medium text-ink">{cover.label}</span>
              <span className="block text-[11.5px] text-ink-muted">{cover.hint}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUrl('cover', sampleUrls[0])}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                
                {cover.url ? 'Replace' : 'Upload'}
              </button>
              {cover.url &&
              <button
                type="button"
                aria-label="Remove cover photo"
                onClick={() => setUrl('cover', null)}
                className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">
                
                  <Trash2Icon size={14} aria-hidden="true" />
                </button>
              }
            </span>
          </figcaption>
        </figure>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-ink-soft">Required shots</p>
          <ul className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {rest.map((photo, index) =>
            <li
              key={photo.id}
              className={[
              'overflow-hidden rounded-xl border',
              photo.url ? 'border-neutral-200' : 'border-dashed border-neutral-300 bg-neutral-50/60'].
              join(' ')}>
              
                {photo.url ?
              <img src={photo.url} alt={photo.label} className="h-[86px] w-full object-cover" /> :

              <div className="flex h-[86px] w-full items-center justify-center">
                    <UploadIcon size={18} className="text-neutral-400" aria-hidden="true" />
                  </div>
              }

                <div className="px-2.5 py-2">
                  <p className="flex items-center gap-1 text-[12px] font-medium text-ink">
                    {photo.url &&
                  <CheckIcon size={11} className="shrink-0 text-lime-600" aria-hidden="true" />
                  }
                    <span className="truncate">{photo.label}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-muted">
                    {photo.hint}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <button
                    type="button"
                    onClick={() => setUrl(photo.id, sampleUrls[index % sampleUrls.length])}
                    className="text-[11px] font-semibold text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
                    
                      {photo.url ? 'Replace' : 'Upload'}
                    </button>
                    {photo.url &&
                  <button
                    type="button"
                    aria-label={`Remove ${photo.label}`}
                    onClick={() => setUrl(photo.id, null)}
                    className="ml-auto rounded-md p-1 text-ink-muted transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">
                    
                        <Trash2Icon size={12} aria-hidden="true" />
                      </button>
                  }
                  </div>
                </div>
              </li>
            )}
          </ul>
          <p className="mt-3 text-[11.5px] text-ink-muted">
            JPG or PNG, 1200 × 800 minimum. Shoot in daylight with the room freshly serviced.
          </p>
        </div>
      </div>
    </SettingsCard>);

}