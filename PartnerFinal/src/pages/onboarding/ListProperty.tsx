import React, { useState } from 'react';
import { ArrowLeftIcon, CheckIcon, CircleCheckBigIcon } from 'lucide-react';
import { BrandLockup } from '../../components/onboarding/BrandLockup';
import {
  LeadChoice,
  LeadField,
  LeadInput,
  LeadSelect,
  LeadTextArea } from
'../../components/onboarding/LeadFormControls';
import {
  emptyLead,
  partnerBenefits,
  propertyTypes,
  referralSources,
  type PropertyLead } from
'../../data/leads';

type ListPropertyProps = {
  onBack: () => void;
};

const cardShadow = { boxShadow: '0 8px 24px rgba(0,0,0,0.04)' };

export function ListProperty({ onBack }: ListPropertyProps) {
  const [lead, setLead] = useState<PropertyLead>(emptyLead);
  const [reference, setReference] = useState<string | null>(null);

  const patch = (changes: Partial<PropertyLead>) => setLead((prev) => ({ ...prev, ...changes }));

  if (reference) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#FAFAFA] px-6 py-14">
        <div className="w-full max-w-[540px] text-center">
          <BrandLockup className="mb-9" />

          <div
            className="rounded-[24px] border border-[#EEF2F7] bg-white p-9"
            style={cardShadow}>
            
            <span className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#D9FF3F]">
              <CircleCheckBigIcon size={38} className="text-[#111111]" aria-hidden="true" />
            </span>

            <h1 className="mt-7 text-[30px] font-bold tracking-tight text-[#111111]">Thank You!</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">
              Your enquiry has been received successfully. Our onboarding team will contact you
              within 24 to 48 hours to discuss your property and onboarding process.
            </p>

            <div className="mt-7 rounded-[16px] border border-[#EEF2F7] bg-[#FAFAFA] px-5 py-4">
              <p className="text-[12.5px] font-medium text-[#94A3B8]">Reference ID</p>
              <p className="mt-1 font-mono text-[20px] font-bold tracking-tight text-[#111111]">
                {reference}
              </p>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="mt-7 h-[52px] w-full rounded-[14px] bg-[#D9FF3F] text-[15px] font-semibold text-[#111111] transition-transform duration-150 ease-out hover:scale-[1.02]">
              
              Back to Home
            </button>
          </div>
        </div>
      </main>);

  }

  return (
    <main className="min-h-screen w-full bg-[#FAFAFA] px-6 py-12">
      <div className="mx-auto w-full max-w-[820px]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#64748B] transition-colors duration-150 ease-out hover:text-[#111111]">
          
          <ArrowLeftIcon size={15} aria-hidden="true" />
          Back
        </button>

        <header className="mt-8 text-center">
          <BrandLockup size="lg" />
          <h1 className="mt-8 text-[36px] font-bold leading-tight tracking-tight text-[#111111] md:text-[42px]">
            Become a Checkdin Partner
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-relaxed text-[#475569]">
            Start receiving short-stay bookings and grow your occupancy with Checkdin's 3-hour,
            6-hour and 12-hour stay platform.
          </p>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {partnerBenefits.map((benefit) =>
            <li
              key={benefit}
              className="flex items-center gap-2 rounded-full border border-[#EEF2F7] bg-white px-4 py-2 text-[13.5px] font-medium text-[#111111]"
              style={cardShadow}>
              
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9FF3F]">
                  <CheckIcon size={12} className="text-[#111111]" aria-hidden="true" />
                </span>
                {benefit}
              </li>
            )}
          </ul>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setReference(`CHK-${Math.floor(1000 + Math.random() * 9000)}`);
          }}
          className="mt-10 rounded-[24px] border border-[#EEF2F7] bg-white p-7 md:p-9"
          style={cardShadow}>
          
          <h2 className="text-[19px] font-bold tracking-tight text-[#111111]">Property details</h2>
          <p className="mt-1 text-[13.5px] text-[#94A3B8]">
            Fields marked with * are required. It takes about two minutes.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            <LeadField id="leadProperty" label="Property Name" required>
              <LeadInput
                id="leadProperty"
                value={lead.propertyName}
                onChange={(e) => patch({ propertyName: e.target.value })}
                placeholder="e.g. Riverside Suites"
                required />
              
            </LeadField>

            <LeadField id="leadContact" label="Contact Person Name" required>
              <LeadInput
                id="leadContact"
                value={lead.contactName}
                onChange={(e) => patch({ contactName: e.target.value })}
                placeholder="Full name"
                required />
              
            </LeadField>

            <LeadField id="leadMobile" label="Mobile Number" required>
              <LeadInput
                id="leadMobile"
                type="tel"
                value={lead.mobile}
                onChange={(e) => patch({ mobile: e.target.value })}
                placeholder="+91 98765 43210"
                required />
              
            </LeadField>

            <LeadField id="leadWhatsapp" label="WhatsApp Number">
              <LeadInput
                id="leadWhatsapp"
                type="tel"
                value={lead.whatsapp}
                onChange={(e) => patch({ whatsapp: e.target.value })}
                placeholder="+91 98765 43210" />
              
            </LeadField>

            <LeadField id="leadEmail" label="Email Address">
              <LeadInput
                id="leadEmail"
                type="email"
                value={lead.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="you@property.com" />
              
            </LeadField>

            <LeadField id="leadCity" label="City" required>
              <LeadInput
                id="leadCity"
                value={lead.city}
                onChange={(e) => patch({ city: e.target.value })}
                placeholder="e.g. Chennai"
                required />
              
            </LeadField>

            <LeadField id="leadType" label="Property Type" required>
              <LeadSelect
                id="leadType"
                value={lead.propertyType}
                onChange={(e) =>
                patch({ propertyType: e.target.value as PropertyLead['propertyType'] })
                }>
                
                {propertyTypes.map((type) =>
                <option key={type}>{type}</option>
                )}
              </LeadSelect>
            </LeadField>

            <LeadField id="leadRooms" label="Total Number of Rooms" required>
              <LeadInput
                id="leadRooms"
                type="number"
                min={1}
                value={lead.totalRooms}
                onChange={(e) => patch({ totalRooms: e.target.value })}
                placeholder="e.g. 24"
                required />
              
            </LeadField>

            <LeadChoice
              name="shortStay"
              label="Interested in Short-Stay Bookings?"
              options={['Yes', 'No']}
              value={lead.shortStayInterest}
              onChange={(value) => patch({ shortStayInterest: value as 'Yes' | 'No' })} />
            

            <LeadChoice
              name="coupleFriendly"
              label="Couple Friendly Property?"
              options={['Yes', 'No']}
              value={lead.coupleFriendly}
              onChange={(value) => patch({ coupleFriendly: value as 'Yes' | 'No' })} />
            

            <LeadField
              id="leadSource"
              label="How Did You Hear About Checkdin?"
              className="md:col-span-2">
              
              <LeadSelect
                id="leadSource"
                value={lead.source}
                onChange={(e) => patch({ source: e.target.value })}>
                
                {referralSources.map((source) =>
                <option key={source}>{source}</option>
                )}
              </LeadSelect>
            </LeadField>

            <LeadField
              id="leadComments"
              label="Additional Comments (Optional)"
              className="md:col-span-2">
              
              <LeadTextArea
                id="leadComments"
                rows={4}
                value={lead.comments}
                onChange={(e) => patch({ comments: e.target.value })}
                placeholder="Anything else we should know about your property" />
              
            </LeadField>
          </div>

          <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-[16px] border border-[#EEF2F7] bg-[#FCFCFC] px-5 py-4">
            <input
              type="checkbox"
              checked={lead.consent}
              onChange={(e) => patch({ consent: e.target.checked })}
              required
              className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] accent-[#B9CF12]" />
            
            <span className="text-[13.5px] leading-relaxed text-[#475569]">
              I agree to be contacted by the Checkdin onboarding team.
            </span>
          </label>

          <button
            type="submit"
            className="mt-6 h-[52px] w-full rounded-[14px] bg-[#D9FF3F] text-[15.5px] font-semibold text-[#111111] transition-transform duration-150 ease-out hover:scale-[1.02]">
            
            List My Property
          </button>

          <p className="mt-4 text-center text-[12.5px] text-[#94A3B8]">
            No setup fees. No commitment until you go live.
          </p>
        </form>
      </div>
    </main>);

}