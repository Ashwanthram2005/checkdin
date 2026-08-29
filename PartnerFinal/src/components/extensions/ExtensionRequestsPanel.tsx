import React, { useCallback, useState } from 'react';
import { CircleCheckBigIcon, HourglassIcon } from 'lucide-react';
import { ExtensionRequestCard } from './ExtensionRequestCard';
import { ExtensionToast } from './ExtensionToast';
import { useAuth } from '../../contexts/AuthContext';
import { extensionRequests as seed, type ExtensionRequest } from '../../data/extensions';
import { inr } from '../../utils/gst';

type ExtensionRequestsPanelProps = {
  showToast?: boolean;
};

export function ExtensionRequestsPanel({ showToast = true }: ExtensionRequestsPanelProps) {
  const { can, addAudit } = useAuth();
  const canAct = can('accept_bookings');
  const [requests, setRequests] = useState<ExtensionRequest[]>(seed);
  const [toastId, setToastId] = useState<string | null>(showToast ? seed[0]?.id ?? null : null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pending = requests.filter((item) => item.status === 'Waiting for Approval');
  const potential = pending.reduce((sum, item) => sum + item.additionalRevenue, 0);
  const toast = requests.find(
    (item) => item.id === toastId && item.status === 'Waiting for Approval'
  );

  const settle = useCallback(
    (request: ExtensionRequest, status: ExtensionRequest['status']) => {
      setRequests((prev) =>
      prev.map((item) => item.id === request.id ? { ...item, status } : item)
      );
      setToastId((prev) => prev === request.id ? null : prev);
    },
    []
  );

  const notify = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 3600);
  };

  const handleApprove = (request: ExtensionRequest) => {
    if (!canAct) {
      notify('Your role cannot approve extensions — permission required.');
      return;
    }
    settle(request, 'Approved');
    notify(
      `✅ Extension approved — checkout moved to ${request.requestedCheckout}. Confirmation sent to ${request.guest}.`
    );
    addAudit({
      action: 'Approved stay extension',
      detail: `#${request.bookingId} • +${request.extraHours}h • ${inr(request.additionalRevenue)}`,
      category: 'Operations'
    });
  };

  const handleReject = (request: ExtensionRequest, reason: string) => {
    if (!canAct) {
      notify('Your role cannot reject extensions — permission required.');
      return;
    }
    settle(request, 'Rejected');
    notify(
      `❌ Extension rejected — ${reason}. ${request.guest} notified, checkout stays at ${request.currentCheckout}.`
    );
    addAudit({
      action: 'Rejected stay extension',
      detail: `#${request.bookingId} • ${reason}`,
      category: 'Operations'
    });
  };

  const handleExpire = useCallback(
    (request: ExtensionRequest) => settle(request, 'Expired'),
    [settle]
  );

  return (
    <section
      id="extension-requests"
      aria-label="Pending extension requests"
      className="rounded-2xl border border-neutral-200/80 bg-white shadow-card">
      
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <HourglassIcon size={16} className="text-orange-600" aria-hidden="true" />
            Pending Extension Requests
            {pending.length > 0 &&
            <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                {pending.length} waiting
              </span>
            }
          </h2>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">
            Guests asking to stay longer. Approve while capacity allows it.
          </p>
        </div>
        {pending.length > 0 &&
        <p className="text-right">
            <span className="block text-[11.5px] text-ink-muted">Revenue at stake</span>
            <span className="text-[17px] font-bold tracking-tight text-ink">{inr(potential)}</span>
          </p>
        }
      </div>

      <div className="space-y-4 p-5">
        {requests.length === 0 ?
        <p className="py-10 text-center text-[13.5px] text-ink-muted">No extension requests.</p> :

        requests.map((request) =>
        <ExtensionRequestCard
          key={request.id}
          request={request}
          onApprove={handleApprove}
          onReject={handleReject}
          onExpire={handleExpire} />

        )
        }
      </div>

      {feedback &&
      <p
        role="status"
        className="mx-5 mb-5 flex items-start gap-2 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-[13px] font-medium text-ink">
        
          <CircleCheckBigIcon
          size={15}
          className="mt-0.5 shrink-0 text-lime-600"
          aria-hidden="true" />
        
          {feedback}
        </p>
      }

      {toast &&
      <ExtensionToast
        request={toast}
        onDismiss={() => setToastId(null)}
        onView={() => {
          setToastId(null);
          document.
          getElementById('extension-requests')?.
          scrollIntoView({ behavior: 'smooth', block: 'start' });
        }} />

      }
    </section>);

}