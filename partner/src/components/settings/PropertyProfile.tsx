import React, { useState } from 'react';
import { CheckIcon, MapPinIcon, PlusIcon, StarIcon } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Field, Select, TextArea, TextInput } from './FormField';
import { amenities, defaultAmenities, galleryPhotos } from '../../data/settings';

export function PropertyProfile() {
  const [description, setDescription] = useState(
    'Hotel Empire Stay is a 25-room boutique property in the heart of T. Nagar, Chennai, built for short-stay and hourly guests. Rooms are serviced between every stay, with 24x7 reception and secure parking.'
  );
  const [selected, setSelected] = useState<string[]>(defaultAmenities);

  const toggleAmenity = (item: string) =>
  setSelected((prev) =>
  prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
  );

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Property description"
        description="Shown on your listing page. Aim for 60–120 words.">
        
        <Field id="description" label="About the property" hint={`${description.length} / 600 characters`}>
          <TextArea
            id="description"
            rows={5}
            maxLength={600}
            value={description}
            onChange={(e) => setDescription(e.target.value)} />
          
        </Field>
      </SettingsCard>

      <SettingsCard title="Address & contact" description="Guests use this to reach and find you.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="address1" label="Property address" className="md:col-span-2">
            <TextInput id="address1" defaultValue="No. 42, Thanikachalam Road, T. Nagar" />
          </Field>
          <Field id="city" label="City">
            <TextInput id="city" defaultValue="Chennai" />
          </Field>
          <Field id="state" label="State">
            <Select id="state" defaultValue="Tamil Nadu">
              <option>Tamil Nadu</option>
              <option>Karnataka</option>
              <option>Kerala</option>
              <option>Telangana</option>
            </Select>
          </Field>
          <Field id="pincode" label="PIN code">
            <TextInput id="pincode" defaultValue="600017" inputMode="numeric" />
          </Field>
          <Field id="maps" label="Google Maps location" hint="Paste a Google Maps share link or coordinates.">
            <TextInput id="maps" defaultValue="https://maps.app.goo.gl/empire-stay-tnagar" />
          </Field>
          <Field id="phone" label="Contact number">
            <TextInput id="phone" type="tel" defaultValue="+91 98407 12345" />
          </Field>
          <Field id="email" label="Email address">
            <TextInput id="email" type="email" defaultValue="stay@empirestay.in" />
          </Field>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] text-ink-soft">
            <MapPinIcon size={16} className="text-lime-600" aria-hidden="true" />
            Pin verified on 12 Jan 2026 — 13.0418° N, 80.2341° E
          </p>
          <button
            type="button"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
            
            Adjust pin
          </button>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Amenities"
        description={`${selected.length} of ${amenities.length} selected`}>
        
        <ul className="flex flex-wrap gap-2">
          {amenities.map((item) => {
            const isOn = selected.includes(item);
            return (
              <li key={item}>
                <button
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => toggleAmenity(item)}
                  className={[
                  'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-150 ease-out',
                  isOn ?
                  'border-ink bg-ink font-medium text-white' :
                  'border-neutral-200 text-ink-soft hover:border-neutral-300'].
                  join(' ')}>
                  
                  {isOn ? <CheckIcon size={13} aria-hidden="true" /> : <PlusIcon size={13} aria-hidden="true" />}
                  {item}
                </button>
              </li>);

          })}
        </ul>
      </SettingsCard>

      <SettingsCard
        title="Photo gallery"
        description="First photo is used as the listing cover. Minimum 1200 × 800px."
        action={
        <button
          type="button"
          className="rounded-lg border border-neutral-200 px-3.5 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
          
            Upload photos
          </button>
        }>
        
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {galleryPhotos.map((photo) =>
          <li key={photo.id} className="group relative overflow-hidden rounded-xl border border-neutral-200">
              <img src={photo.url} alt={photo.label} className="h-32 w-full object-cover" />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[12.5px] font-medium text-ink">{photo.label}</span>
                {photo.cover ?
              <span className="flex items-center gap-1 rounded-md bg-lime-100 px-2 py-0.5 text-[10.5px] font-semibold text-lime-600">
                    <StarIcon size={11} aria-hidden="true" />
                    Cover
                  </span> :

              <button
                type="button"
                className="text-[11.5px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink">
                
                    Make cover
                  </button>
              }
              </div>
            </li>
          )}
          <li>
            <button
              type="button"
              className="flex h-full min-h-[168px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50">
              
              <PlusIcon size={20} className="text-ink-muted" aria-hidden="true" />
              <span className="text-[12.5px] font-medium text-ink">Add photo</span>
            </button>
          </li>
        </ul>
      </SettingsCard>
    </div>);

}