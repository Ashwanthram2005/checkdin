export type PolicyToggle = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const houseRules: PolicyToggle[] = [
{
  id: 'localId',
  label: 'Accept local IDs',
  description: 'Allow guests from the same city to check in with a local address proof.',
  enabled: true
},
{
  id: 'unmarried',
  label: 'Couple friendly',
  description: 'Unmarried couples with valid IDs are welcome.',
  enabled: true
},
{
  id: 'pets',
  label: 'Pets allowed',
  description: 'Guests may bring one pet under 10 kg per booking.',
  enabled: false
},
{
  id: 'smoking',
  label: 'Smoking permitted',
  description: 'Smoking is allowed only in designated balcony rooms.',
  enabled: false
},
{
  id: 'visitors',
  label: 'Outside visitors',
  description: 'Non-registered visitors may enter the room during the slot.',
  enabled: false
},
{
  id: 'earlyEntry',
  label: 'Allow early entry',
  description: 'Let guests enter up to 30 minutes before the slot starts, when free.',
  enabled: true
}];


export const cancellationTiers = [
{ id: 'c1', window: 'More than 6 hours before check-in', refund: '100% refund', tone: 'good' as const },
{ id: 'c2', window: '2 to 6 hours before check-in', refund: '50% refund', tone: 'warn' as const },
{ id: 'c3', window: 'Under 2 hours before check-in', refund: 'No refund', tone: 'bad' as const },
{ id: 'c4', window: 'No-show', refund: 'No refund, slot released', tone: 'bad' as const }];


export const acceptedIds = [
'Aadhaar Card',
'Passport',
'Driving Licence',
'Voter ID',
'PAN Card',
'Government Employee ID'];


export const defaultAcceptedIds = ['Aadhaar Card', 'Passport', 'Driving Licence', 'Voter ID'];