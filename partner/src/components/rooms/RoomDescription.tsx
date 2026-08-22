import React, { useState } from 'react';
import { MapPinIcon, PlusIcon, XIcon } from 'lucide-react';
import { SettingsCard } from '../settings/SettingsCard';
import { Field, TextArea, TextInput } from '../settings/FormField';
import type { RoomType } from '../../data/rooms';

type RoomDescriptionProps = {
  description: RoomType['description'];
  onChange: (description: RoomType['description']) => void;
};

export function RoomDescription({ description, onChange }: RoomDescriptionProps) {
  const [highlight, setHighlight] = useState('');
  const [landmark, setLandmark] = useState({ name: '', distance: '' });

  const addHighlight = () => {
    const value = highlight.trim();
    if (!value) return;
    onChange({ ...description, highlights: [...description.highlights, value] });
    setHighlight('');
  };

  const addLandmark = () => {
    if (!landmark.name.trim()) return;
    onChange({
      ...description,
      landmarks: [
      ...description.landmarks,
      { id: `l${Date.now()}`, name: landmark.name.trim(), distance: landmark.distance.trim() || '—' }]

    });
    setLandmark({ name: '', distance: '' });
  };

  return (
    <SettingsCard title="Room description" description="Shown on the room detail page for guests.">
      <Field
        id="shortDescription"
        label="Short description"
        hint={`${description.short.length} / 400 characters`}>
        
        <TextArea
          id="shortDescription"
          rows={3}
          maxLength={400}
          value={description.short}
          onChange={(e) => onChange({ ...description, short: e.target.value })} />
        
      </Field>

      <div className="mt-5">
        <p className="text-[13px] font-medium text-ink-soft">Highlights</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {description.highlights.map((item) =>
          <li
            key={item}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 pl-3.5 pr-2 py-1.5 text-[13px] text-ink">
            
              {item}
              <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() =>
              onChange({
                ...description,
                highlights: description.highlights.filter((h) => h !== item)
              })
              }
              className="rounded-full p-0.5 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-200 hover:text-ink">
              
                <XIcon size={12} aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
        <div className="mt-3 flex gap-2">
          <TextInput
            aria-label="New highlight"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addHighlight();
              }
            }}
            placeholder="e.g. Blackout curtains"
            className="max-w-[280px]" />
          
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
            
            <PlusIcon size={14} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-neutral-100 pt-5">
        <p className="text-[13px] font-medium text-ink-soft">Nearby landmarks</p>
        <ul className="mt-2 divide-y divide-neutral-100">
          {description.landmarks.map((item) =>
          <li key={item.id} className="flex items-center gap-3 py-2.5">
              <MapPinIcon size={15} className="shrink-0 text-ink-muted" aria-hidden="true" />
              <span className="flex-1 text-[13.5px] text-ink">{item.name}</span>
              <span className="text-[12.5px] text-ink-muted">{item.distance}</span>
              <button
              type="button"
              aria-label={`Remove ${item.name}`}
              onClick={() =>
              onChange({
                ...description,
                landmarks: description.landmarks.filter((l) => l.id !== item.id)
              })
              }
              className="rounded-md p-1 text-ink-muted transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">
              
                <XIcon size={14} aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <TextInput
            aria-label="Landmark name"
            value={landmark.name}
            onChange={(e) => setLandmark({ ...landmark, name: e.target.value })}
            placeholder="Landmark name"
            className="max-w-[280px]" />
          
          <TextInput
            aria-label="Distance"
            value={landmark.distance}
            onChange={(e) => setLandmark({ ...landmark, distance: e.target.value })}
            placeholder="Distance, e.g. 800 m"
            className="max-w-[180px]" />
          
          <button
            type="button"
            onClick={addLandmark}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
            
            <PlusIcon size={14} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>
    </SettingsCard>);

}