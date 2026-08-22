import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  Trash2Icon } from
'lucide-react';
import { SettingsCard } from './SettingsCard';
import { UploadDropzone } from './UploadDropzone';
import { propertyDocuments, type DocumentStatus } from '../../data/settings';

const statusStyles: Record<DocumentStatus, {chip: string;icon: typeof CheckCircle2Icon;}> = {
  Verified: { chip: 'bg-lime-100 text-lime-600', icon: CheckCircle2Icon },
  'Under review': { chip: 'bg-blue-50 text-blue-700', icon: ClockIcon },
  Missing: { chip: 'bg-amber-50 text-amber-700', icon: AlertTriangleIcon },
  Rejected: { chip: 'bg-red-50 text-red-600', icon: AlertTriangleIcon }
};

export function DocumentsVerification() {
  const [documents] = useState(propertyDocuments);
  const verified = documents.filter((doc) => doc.status === 'Verified').length;
  const progress = Math.round(verified / documents.length * 100);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-ink p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[13px] font-medium text-white/60">Verification status</p>
            <p className="mt-2 text-[24px] font-bold tracking-tight">Partially verified</p>
            <p className="mt-1.5 text-[13px] text-white/60">
              {verified} of {documents.length} documents approved. Complete verification to unlock
              instant payouts.
            </p>
          </div>
          <div className="w-full max-w-[260px]">
            <div className="flex items-center justify-between text-[12px] text-white/60">
              <span>Progress</span>
              <span className="font-semibold text-lime-300">{progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-lime-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-[12px] text-white/50">
              Reviews are completed within 24–48 working hours.
            </p>
          </div>
        </div>
      </section>

      <SettingsCard
        title="Property documents"
        description="Accepted formats: PDF, JPG or PNG up to 5 MB each."
        bodyClassName="divide-y divide-neutral-100">
        
        {documents.map((doc) => {
          const style = statusStyles[doc.status];
          const StatusIcon = style.icon;
          return (
            <div
              key={doc.id}
              className="flex flex-col gap-4 px-5 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center">
              
              <div className="flex flex-1 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                  <FileTextIcon size={18} className="text-ink" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-ink">{doc.label}</p>
                  <p className="mt-0.5 text-[12px] text-ink-muted">
                    {doc.fileName ? `${doc.fileName} • Uploaded ${doc.uploadedOn}` : doc.hint}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:w-[400px] lg:justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${style.chip}`}>
                  
                  <StatusIcon size={13} aria-hidden="true" />
                  {doc.status}
                </span>

                {doc.fileName ?
                <>
                    <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                    
                      <DownloadIcon size={13} aria-hidden="true" />
                      View
                    </button>
                    <button
                    type="button"
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                    
                      Replace
                    </button>
                    <button
                    type="button"
                    aria-label={`Delete ${doc.label}`}
                    className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">
                    
                      <Trash2Icon size={15} aria-hidden="true" />
                    </button>
                  </> :

                <button
                  type="button"
                  className="rounded-lg bg-ink px-3.5 py-2 text-[12.5px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
                  
                    Upload document
                  </button>
                }
              </div>
            </div>);

        })}
      </SettingsCard>

      <SettingsCard title="Add a new document" description="Drag and drop or browse from your device.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <UploadDropzone label="GST Certificate" hint="PDF or JPG, max 5 MB" />
          <UploadDropzone label="PAN Card" hint="PDF or JPG, max 5 MB" />
          <UploadDropzone label="Trade License" hint="PDF only, max 5 MB" />
          <UploadDropzone label="Property Registration" hint="Deed or lease, max 10 MB" />
        </div>
      </SettingsCard>
    </div>);

}