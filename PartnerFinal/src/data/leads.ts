export const propertyTypes = ['Hotel', 'Service Apartment', 'Guest House', 'Homestay'] as const;

export type PropertyType = (typeof propertyTypes)[number];

export const referralSources = [
'Google',
'Facebook',
'Instagram',
'Friend / Reference',
'Sales Team',
'Other'] as
const;

export const partnerBenefits = [
'No setup fees',
'Go live in as little as 48 hours',
'Dedicated onboarding support'];


export type PropertyLead = {
  propertyName: string;
  contactName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  propertyType: PropertyType;
  totalRooms: string;
  shortStayInterest: 'Yes' | 'No';
  coupleFriendly: 'Yes' | 'No';
  source: string;
  comments: string;
  consent: boolean;
};

export const emptyLead: PropertyLead = {
  propertyName: '',
  contactName: '',
  mobile: '',
  whatsapp: '',
  email: '',
  city: '',
  propertyType: 'Hotel',
  totalRooms: '',
  shortStayInterest: 'Yes',
  coupleFriendly: 'Yes',
  source: 'Google',
  comments: '',
  consent: false
};