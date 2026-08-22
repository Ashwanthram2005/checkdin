import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BedDoubleIcon,
  BuildingIcon,
  CreditCardIcon,
  LogInIcon,
  LogOutIcon,
  PencilIcon,
  UserIcon,
  XCircleIcon } from
'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DefinitionList, Timeline } from '../components/ui/Primitives';
import { Modal } from '../components/ui/Modal';
import { Input, Label, Select, Textarea } from '../components/ui/Field';
import { BlockSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';

type ActionKey = 'modify' | 'cancel' | 'checkin' | 'checkout' | null;

export function BookingDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: booking, loading, error } = useMockQuery(() => api.getBooking(id), [id]);
  const [action, setAction] = useState<ActionKey>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <BlockSkeleton className="h-20" />
        <BlockSkeleton className="h-72" />
      </div>);

  }

  if (error || !booking) {
    return (
      <Card>
        <ErrorState message={error ?? `We could not find booking ${id}.`} onRetry={() => navigate('/bookings')} />
      </Card>);

  }

  const total = booking.amount + booking.tax;

  return (
    <div>
      <Link
        to="/bookings"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-150 ease-smooth hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" /> All bookings
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-ink">{booking.code}</h1>
            <Badge>{booking.status}</Badge>
            <Badge>{booking.paymentStatus}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            Created {formatDate(booking.createdAt)} via {booking.source} · {booking.propertyName}, {booking.city}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={PencilIcon} onClick={() => setAction('modify')}>
            Modify
          </Button>
          <Button icon={LogInIcon} onClick={() => setAction('checkin')}>
            Force check-in
          </Button>
          <Button icon={LogOutIcon} onClick={() => setAction('checkout')}>
            Force check-out
          </Button>
          <Button variant="danger" icon={XCircleIcon} onClick={() => setAction('cancel')}>
            Cancel
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader
              title="Stay summary"
              subtitle={`${booking.nights} night${booking.nights > 1 ? 's' : ''} · ${booking.guests} guests`} />
            
            <div className="px-5 py-5">
              <DefinitionList
                columns={3}
                items={[
                { label: 'Check-in', value: formatDate(booking.checkIn) },
                { label: 'Check-out', value: formatDate(booking.checkOut) },
                { label: 'Room', value: `${booking.roomName} (${booking.roomType})` }]
                } />
              
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Customer" />
              <div className="px-5 py-5">
                <DefinitionList
                  columns={1}
                  items={[
                  { label: 'Name', value: booking.customerName },
                  { label: 'Email', value: booking.customerEmail },
                  { label: 'Phone', value: booking.customerPhone },
                  {
                    label: 'Profile',
                    value:
                    <Link
                      to={`/customers/${booking.customerId}`}
                      className="inline-flex items-center gap-1 text-info hover:underline">
                      
                          <UserIcon className="h-3.5 w-3.5" /> {booking.customerId}
                        </Link>

                  }]
                  } />
                
              </div>
            </Card>

            <Card>
              <CardHeader title="Property & room" />
              <div className="px-5 py-5">
                <DefinitionList
                  columns={1}
                  items={[
                  {
                    label: 'Property',
                    value:
                    <Link
                      to={`/properties/${booking.propertyId}`}
                      className="inline-flex items-center gap-1 text-info hover:underline">
                      
                          <BuildingIcon className="h-3.5 w-3.5" /> {booking.propertyName}
                        </Link>

                  },
                  { label: 'City', value: booking.city },
                  {
                    label: 'Room',
                    value:
                    <span className="inline-flex items-center gap-1">
                          <BedDoubleIcon className="h-3.5 w-3.5 text-muted" /> {booking.roomName}
                        </span>

                  },
                  { label: 'Room type', value: booking.roomType }]
                  } />
                
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Payment"
              subtitle={booking.paymentMethod}
              action={<Badge>{booking.paymentStatus}</Badge>} />
            
            <div className="px-5 py-5">
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Room charges</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatCurrency(booking.amount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">GST (12%)</dt>
                  <dd className="font-medium tabular-nums text-ink">{formatCurrency(booking.tax)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Platform commission</dt>
                  <dd className="font-medium tabular-nums text-ink">−{formatCurrency(booking.commission)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2.5">
                  <dt className="font-semibold text-ink">Guest total</dt>
                  <dd className="text-base font-bold tabular-nums text-ink">{formatCurrency(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Partner payable</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {formatCurrency(booking.amount - booking.commission)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-muted">
                <CreditCardIcon className="h-3.5 w-3.5" /> {booking.transactionId}
              </p>
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Booking timeline" subtitle="Newest first" />
          <div className="px-5 py-5">
            <Timeline events={booking.timeline} />
          </div>
        </Card>
      </div>

      <Modal
        open={action === 'modify'}
        onClose={() => setAction(null)}
        title="Modify booking"
        description={`Changes to ${booking.code} notify the guest and the property.`}
        footer={
        <>
            <Button onClick={() => setAction(null)}>Discard</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate('booking.modify', { id: booking.id });
              setAction(null);
            }}>
            
              Save changes
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="checkin">Check-in</Label>
            <Input id="checkin" type="date" defaultValue={booking.checkIn} />
          </div>
          <div>
            <Label htmlFor="checkout">Check-out</Label>
            <Input id="checkout" type="date" defaultValue={booking.checkOut} />
          </div>
          <div>
            <Label htmlFor="room">Room</Label>
            <Select
              id="room"
              options={['Deluxe Twin 204', 'Standard 108', 'Executive Suite 501', 'Deluxe King 302']}
              defaultValue={booking.roomName} />
            
          </div>
          <div>
            <Label htmlFor="guests">Guests</Label>
            <Input id="guests" type="number" min={1} max={6} defaultValue={booking.guests} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="note">Internal note</Label>
            <Textarea id="note" placeholder="Why is this booking being modified?" />
          </div>
        </div>
      </Modal>

      <Modal
        open={action === 'cancel'}
        onClose={() => setAction(null)}
        title="Cancel booking"
        description="The guest is refunded per the property cancellation policy."
        width="sm"
        footer={
        <>
            <Button onClick={() => setAction(null)}>Keep booking</Button>
            <Button
            variant="danger"
            onClick={() => {
              api.mutate('booking.cancel', { id: booking.id });
              setAction(null);
            }}>
            
              Cancel booking
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Cancellation reason</Label>
            <Select
              id="reason"
              options={[
              'Guest request',
              'Property unavailable',
              'Payment failure',
              'Suspected fraud',
              'Duplicate booking']
              } />
            
          </div>
          <div>
            <Label htmlFor="refund">Refund treatment</Label>
            <Select id="refund" options={['Full refund', 'Partial refund (50%)', 'No refund']} />
          </div>
        </div>
      </Modal>

      <Modal
        open={action === 'checkin' || action === 'checkout'}
        onClose={() => setAction(null)}
        title={action === 'checkin' ? 'Force check-in' : 'Force check-out'}
        description={
        action === 'checkin' ?
        'Marks the guest as checked in without a front-desk scan. This is logged in the audit trail.' :
        'Closes the stay and releases the room back to inventory.'
        }
        width="sm"
        footer={
        <>
            <Button onClick={() => setAction(null)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate(action === 'checkin' ? 'booking.forceCheckIn' : 'booking.forceCheckOut', {
                id: booking.id
              });
              setAction(null);
            }}>
            
              Confirm
            </Button>
          </>
        }>
        
        <div>
          <Label htmlFor="override-note">Reason for override</Label>
          <Textarea id="override-note" placeholder="e.g. Guest arrived, property PMS offline" />
        </div>
      </Modal>
    </div>);

}