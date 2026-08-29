/**
 * AdminOS platform state.
 *
 * This is the single write path for every AdminOS module. Actions are applied
 * by a pure reducer, each one produces an immutable audit record and any
 * downstream notifications, and the result is persisted so changes survive a
 * reload. Swap `persist`/`hydrate` for HTTP calls and the reducer becomes the
 * server contract unchanged.
 */
import {
  extensionRequests,
  type ExtensionRequest,
  type ExtensionType } from
'../../data/adminos/extensions';
import {
  hotelVisibility,
  visibilityLogs,
  type HotelVisibility,
  type VisibilityLog,
  type VisibilityState } from
'../../data/adminos/hotelStatus';
import {
  complianceRecords,
  disputes,
  promotions,
  riskEntities,
  settlements,
  type ComplianceRecord,
  type Dispute,
  type DisputeStatus,
  type Promotion,
  type RiskBand,
  type RiskEntity,
  type Settlement,
  type VerificationState } from
'../../data/adminos/governance';
import {
  defaultGuardrails,
  partnerPricingRules,
  type Guardrails,
  type PartnerPricingRule } from
'../../data/adminos/pricing';
import { seedLiveEvents, type LiveEvent } from '../../data/adminos/liveEvents';

/* -------------------------------------------------------------------- types */

export interface OsActor {
  name: string;
  email: string;
  role: string;
  roleId: string;
  ip: string;
}

export interface OsAuditRecord {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  previousState: string;
  newState: string;
  reason: string;
  adminName: string;
  adminEmail: string;
  role: string;
  at: string;
  iso: string;
  ip: string;
}

export type NotificationChannel = 'Customer' | 'Partner' | 'Internal' | 'Finance';

export interface OsNotification {
  id: string;
  title: string;
  detail: string;
  channel: NotificationChannel;
  at: string;
  iso: string;
  read: boolean;
  archived: boolean;
  link?: string;
}

export type RiskStatus = 'Monitoring' | 'Investigating' | 'Cleared' | 'Blocked';

export interface RiskRecord extends RiskEntity {
  status: RiskStatus;
  note: string;
}

export interface DisputeRecord extends Dispute {
  resolution: string;
  assignedTo: string;
  history: {at: string;note: string;}[];
}

export interface SettlementRecord extends Settlement {
  holdReason: string;
  releasedAt: string | null;
  utr: string | null;
}

export interface ExtensionRecord extends ExtensionRequest {
  reason: string;
  checkoutShiftHours: number;
}

export interface ComplianceRecordLive extends ComplianceRecord {
  notes: string[];
  requestedDocuments: string[];
}

export interface AdminOsState {
  extensions: ExtensionRecord[];
  visibility: HotelVisibility[];
  visibilityLogs: VisibilityLog[];
  settlements: SettlementRecord[];
  promotions: Promotion[];
  disputes: DisputeRecord[];
  risks: RiskRecord[];
  compliance: ComplianceRecordLive[];
  pricingRules: PartnerPricingRule[];
  guardrails: Guardrails;
  audit: OsAuditRecord[];
  notifications: OsNotification[];
  events: LiveEvent[];
}

/* ---------------------------------------------------------------- utilities */

const extensionHours: Record<ExtensionType, number> = {
  '1 hour': 1,
  '3 hours': 3,
  '6 hours': 6,
  'Full night': 12
};

const extensionRates: Record<ExtensionType, number> = {
  '1 hour': 420,
  '3 hours': 1180,
  '6 hours': 1940,
  'Full night': 2860
};

let sequence = 0;
function uid(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence}`;
}

function clock(): {at: string;iso: string;} {
  const now = new Date();
  return {
    at: now.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    iso: now.toISOString()
  };
}

function bandFor(score: number): RiskBand {
  if (score >= 75) return 'High';
  if (score >= 45) return 'Medium';
  return 'Low';
}

/* --------------------------------------------------------------------- seed */

export function seedState(): AdminOsState {
  return {
    extensions: extensionRequests.map((request) => ({
      ...request,
      reason: '',
      checkoutShiftHours: request.status === 'Approved' ? extensionHours[request.type] : 0
    })),
    visibility: hotelVisibility.map((hotel) => ({ ...hotel })),
    visibilityLogs: visibilityLogs.map((log) => ({ ...log })),
    settlements: settlements.map((settlement) => ({
      ...settlement,
      holdReason: settlement.status === 'On Hold' ? 'Carried over from the previous cycle review' : '',
      releasedAt: settlement.status === 'Processed' ? settlement.scheduledFor : null,
      utr: settlement.status === 'Processed' ? `UTR${settlement.reference.replace(/\D/g, '').slice(-10)}` : null
    })),
    promotions: promotions.map((promotion) => ({ ...promotion })),
    disputes: disputes.map((dispute) => ({
      ...dispute,
      resolution: '',
      assignedTo: 'Unassigned',
      history: [{ at: dispute.at, note: `Case opened by ${dispute.raisedBy}` }]
    })),
    risks: riskEntities.map((entity) => ({ ...entity, status: 'Monitoring' as RiskStatus, note: '' })),
    compliance: complianceRecords.map((record) => ({ ...record, notes: [], requestedDocuments: [] })),
    pricingRules: partnerPricingRules.map((rule) => ({ ...rule })),
    guardrails: { ...defaultGuardrails },
    audit: [],
    notifications: [],
    events: seedLiveEvents.map((event) => ({ ...event }))
  };
}

/* ------------------------------------------------------------------ actions */

export type OsAction =
{type: 'extension.approve';id: string;note?: string;} |
{type: 'extension.reject';id: string;reason: string;} |
{type: 'extension.expire';id: string;} |
{type: 'visibility.set';propertyId: string;to: VisibilityState;reason: string;} |
{type: 'settlement.release';id: string;} |
{type: 'settlement.hold';id: string;reason: string;} |
{type: 'settlement.recalculate';id: string;note?: string;} |
{type: 'settlement.releaseAll';ids: string[];} |
{type: 'promotion.setStatus';id: string;status: Promotion['status'];reason?: string;} |
{type: 'promotion.override';id: string;cap: number;limit: number;scope: string;} |
{type: 'promotion.emergencyDisable';} |
{type: 'dispute.decide';id: string;outcome: DisputeStatus;amount?: number;note: string;} |
{type: 'dispute.escalate';id: string;assignedTo: string;} |
{type: 'risk.setStatus';id: string;status: RiskStatus;note?: string;} |
{type: 'compliance.setCheck';propertyId: string;check: keyof ComplianceRecord;state: VerificationState;reason?: string;} |
{type: 'compliance.requestDocuments';propertyId: string;documents: string;note: string;} |
{type: 'compliance.setStage';propertyId: string;stage: ComplianceRecord['stage'];reason?: string;} |
{type: 'pricing.override';id: string;overrideType: string;value: number;reason: string;} |
{type: 'pricing.setStatus';id: string;status: PartnerPricingRule['status'];reason?: string;} |
{type: 'pricing.guardrails';patch: Partial<Guardrails>;} |
{type: 'notification.read';id: string;read: boolean;} |
{type: 'notification.archive';id: string;} |
{type: 'notification.readAll';} |
{type: 'super.execute';actionId: string;label: string;target: string;reason: string;} |
{type: 'events.push';event: LiveEvent;} |
{type: 'audit.record';entry: Omit<OsAuditRecord, 'id' | 'at' | 'iso' | 'ip' | 'adminName' | 'adminEmail' | 'role'>;};

interface Effect {
  audit?: Omit<OsAuditRecord, 'id' | 'at' | 'iso' | 'ip' | 'adminName' | 'adminEmail' | 'role'>;
  notify?: Omit<OsNotification, 'id' | 'at' | 'iso' | 'read' | 'archived'>[];
  event?: LiveEvent;
}

/** Applies an action, returning the next state plus the audit + notifications it produced. */
export function reduce(state: AdminOsState, action: OsAction, actor: OsActor): AdminOsState {
  const { at, iso } = clock();
  let next = state;
  const effects: Effect = {};

  switch (action.type) {
    case 'extension.approve':{
        const target = state.extensions.find((row) => row.id === action.id);
        if (!target) break;
        const hours = extensionHours[target.type];
        const revenue = extensionRates[target.type];
        next = {
          ...state,
          extensions: state.extensions.map((row) =>
          row.id === action.id ?
          {
            ...row,
            status: 'Approved',
            decidedAt: at,
            responseMinutes: row.responseMinutes ?? 4,
            revenue,
            checkoutShiftHours: hours,
            reason: action.note ?? ''
          } :
          row
          )
        };
        effects.audit = {
          action: 'Approve extension',
          entityType: 'Extension',
          entityId: target.id,
          entityLabel: `${target.bookingId} · ${target.propertyName}`,
          previousState: target.status,
          newState: `Approved · checkout +${hours}h · ₹${revenue} recorded`,
          reason: action.note ?? 'Approved by platform operations'
        };
        effects.notify = [
        {
          title: 'Extension approved',
          detail: `${target.guestName} can stay ${hours} more hours at ${target.propertyName}. Checkout time updated and ₹${revenue} charged.`,
          channel: 'Customer',
          link: '/os/extensions'
        },
        {
          title: 'Extension confirmed with hotel',
          detail: `${target.propertyName} notified — booking ${target.bookingId} duration extended by ${hours}h.`,
          channel: 'Partner',
          link: '/os/extensions'
        }];

        effects.event = {
          id: uid('EVT'),
          kind: 'Extension Approved',
          propertyName: target.propertyName,
          city: target.city,
          guestName: target.guestName,
          reference: target.bookingId,
          amount: revenue,
          at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        break;
      }

    case 'extension.reject':{
        const target = state.extensions.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          extensions: state.extensions.map((row) =>
          row.id === action.id ?
          { ...row, status: 'Rejected', decidedAt: at, responseMinutes: row.responseMinutes ?? 6, revenue: 0, reason: action.reason } :
          row
          )
        };
        effects.audit = {
          action: 'Reject extension',
          entityType: 'Extension',
          entityId: target.id,
          entityLabel: `${target.bookingId} · ${target.propertyName}`,
          previousState: target.status,
          newState: 'Rejected',
          reason: action.reason
        };
        effects.notify = [
        {
          title: 'Extension declined',
          detail: `${target.guestName} was told the extension could not be granted. Reason: ${action.reason}`,
          channel: 'Customer',
          link: '/os/extensions'
        }];

        break;
      }

    case 'extension.expire':{
        const target = state.extensions.find((row) => row.id === action.id);
        if (!target || target.status !== 'Pending') break;
        next = {
          ...state,
          extensions: state.extensions.map((row) =>
          row.id === action.id ? { ...row, status: 'Expired', decidedAt: at, responseMinutes: 60, revenue: 0 } : row
          )
        };
        effects.audit = {
          action: 'Expire extension',
          entityType: 'Extension',
          entityId: target.id,
          entityLabel: `${target.bookingId} · ${target.propertyName}`,
          previousState: 'Pending',
          newState: 'Expired after the 60-minute response window',
          reason: 'No hotel response within the SLA'
        };
        effects.notify = [
        {
          title: 'Extension request expired',
          detail: `${target.propertyName} did not respond within 60 minutes. ${target.guestName} was notified and refunded any hold.`,
          channel: 'Customer',
          link: '/os/extensions'
        }];

        break;
      }

    case 'visibility.set':{
        const target = state.visibility.find((row) => row.propertyId === action.propertyId);
        if (!target) break;
        const log: VisibilityLog = {
          id: uid('VIS'),
          propertyId: target.propertyId,
          propertyName: target.propertyName,
          from: target.state,
          to: action.to,
          changedBy: `${actor.name} (${actor.role})`,
          at,
          duration: target.days ? `${target.days}d` : '—'
        };
        next = {
          ...state,
          visibility: state.visibility.map((row) =>
          row.propertyId === action.propertyId ?
          {
            ...row,
            state: action.to,
            since: action.to === 'Live' ? '—' : at,
            days: action.to === 'Live' ? 0 : row.days,
            reason: action.reason,
            pauses30d: action.to === 'Paused' ? row.pauses30d + 1 : row.pauses30d
          } :
          row
          ),
          visibilityLogs: [log, ...state.visibilityLogs]
        };
        effects.audit = {
          action: `Set visibility → ${action.to}`,
          entityType: 'Hotel',
          entityId: target.propertyId,
          entityLabel: target.propertyName,
          previousState: target.state,
          newState:
          action.to === 'Live' ?
          'Live — bookable and visible in search' :
          action.to === 'Paused' ?
          'Paused — new bookings disabled, active stays preserved' :
          action.to === 'Offline' ?
          'Offline — hidden from search, existing bookings preserved' :
          'Vacation — seasonal closure',
          reason: action.reason
        };
        effects.notify = [
        {
          title: `${target.propertyName} is now ${action.to}`,
          detail:
          action.to === 'Live' ?
          'Inventory restored to search and new bookings are enabled.' :
          'New bookings are disabled. Confirmed stays are unaffected.',
          channel: 'Partner',
          link: '/os/hotel-status'
        }];

        break;
      }

    case 'settlement.release':{
        const target = state.settlements.find((row) => row.id === action.id);
        if (!target) break;
        const utr = `UTR${Date.now().toString().slice(-10)}`;
        next = {
          ...state,
          settlements: state.settlements.map((row) =>
          row.id === action.id ? { ...row, status: 'Processed', releasedAt: at, holdReason: '', utr } : row
          )
        };
        effects.audit = {
          action: 'Release settlement',
          entityType: 'Settlement',
          entityId: target.reference,
          entityLabel: `${target.propertyName} · ${target.cycle}`,
          previousState: target.status,
          newState: `Processed · ₹${target.net.toLocaleString('en-IN')} · ${utr}`,
          reason: 'Payout released to the partner settlement account'
        };
        effects.notify = [
        {
          title: 'Payout released',
          detail: `₹${target.net.toLocaleString('en-IN')} sent to ${target.partnerName} for ${target.cycle}. Reference ${utr}.`,
          channel: 'Partner',
          link: '/os/settlements'
        }];

        break;
      }

    case 'settlement.hold':{
        const target = state.settlements.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          settlements: state.settlements.map((row) =>
          row.id === action.id ? { ...row, status: 'On Hold', holdReason: action.reason } : row
          )
        };
        effects.audit = {
          action: 'Hold settlement',
          entityType: 'Settlement',
          entityId: target.reference,
          entityLabel: `${target.propertyName} · ${target.cycle}`,
          previousState: target.status,
          newState: 'On Hold — excluded from every payout cycle',
          reason: action.reason
        };
        effects.notify = [
        {
          title: 'Settlement held',
          detail: `${target.reference} for ${target.partnerName} is frozen. Reason: ${action.reason}`,
          channel: 'Finance',
          link: '/os/settlements'
        }];

        break;
      }

    case 'settlement.recalculate':{
        const target = state.settlements.find((row) => row.id === action.id);
        if (!target) break;
        const commission = Math.round(target.gross * 0.12);
        const gst = Math.round(commission * 0.18);
        const netValue = target.gross - commission - gst;
        next = {
          ...state,
          settlements: state.settlements.map((row) =>
          row.id === action.id ? { ...row, commission, gst, net: netValue } : row
          )
        };
        effects.audit = {
          action: 'Recalculate settlement',
          entityType: 'Settlement',
          entityId: target.reference,
          entityLabel: `${target.propertyName} · ${target.cycle}`,
          previousState: `commission ₹${target.commission} · GST ₹${target.gst} · net ₹${target.net}`,
          newState: `commission ₹${commission} · GST ₹${gst} · net ₹${netValue}`,
          reason: action.note || 'Recomputed from the booking ledger'
        };
        break;
      }

    case 'settlement.releaseAll':{
        const utrBase = Date.now().toString().slice(-8);
        const affected = state.settlements.filter((row) => action.ids.includes(row.id));
        const total = affected.reduce((sum, row) => sum + row.net, 0);
        next = {
          ...state,
          settlements: state.settlements.map((row, index) =>
          action.ids.includes(row.id) ?
          { ...row, status: 'Processed', releasedAt: at, holdReason: '', utr: `UTR${utrBase}${index}` } :
          row
          )
        };
        effects.audit = {
          action: 'Release settlement batch',
          entityType: 'Settlement',
          entityId: `${affected.length} settlements`,
          entityLabel: 'Bulk payout release',
          previousState: 'Pending',
          newState: `Processed · ₹${total.toLocaleString('en-IN')} across ${affected.length} partners`,
          reason: 'Cycle release approved by finance'
        };
        effects.notify = [
        {
          title: 'Payout batch released',
          detail: `₹${total.toLocaleString('en-IN')} released across ${affected.length} partner accounts.`,
          channel: 'Finance',
          link: '/os/settlements'
        }];

        break;
      }

    case 'promotion.setStatus':{
        const target = state.promotions.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          promotions: state.promotions.map((row) => row.id === action.id ? { ...row, status: action.status } : row)
        };
        effects.audit = {
          action: `Promotion → ${action.status}`,
          entityType: 'Promotion',
          entityId: target.code,
          entityLabel: target.name,
          previousState: target.status,
          newState: action.status,
          reason: action.reason || 'Promotions governance decision'
        };
        effects.notify = [
        {
          title: `${target.code} ${action.status.toLowerCase()}`,
          detail: `${target.name} is now ${action.status.toLowerCase()} across ${target.scope}.`,
          channel: 'Internal',
          link: '/os/promotions'
        }];

        break;
      }

    case 'promotion.override':{
        const target = state.promotions.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          promotions: state.promotions.map((row) =>
          row.id === action.id ?
          { ...row, discount: `Capped at ₹${action.cap}`, scope: action.scope === 'Keep current scope' ? row.scope : action.scope } :
          row
          )
        };
        effects.audit = {
          action: 'Override promotion',
          entityType: 'Promotion',
          entityId: target.code,
          entityLabel: target.name,
          previousState: `${target.discount} · ${target.scope}`,
          newState: `Capped at ₹${action.cap} · limit ${action.limit} · ${action.scope}`,
          reason: 'Platform override applied above the partner configuration'
        };
        break;
      }

    case 'promotion.emergencyDisable':{
        const affected = state.promotions.filter((row) => row.status === 'Active' || row.status === 'Scheduled');
        next = {
          ...state,
          promotions: state.promotions.map((row) =>
          row.status === 'Active' || row.status === 'Scheduled' ? { ...row, status: 'Paused' } : row
          )
        };
        effects.audit = {
          action: 'Emergency disable promotions',
          entityType: 'Promotion',
          entityId: 'ALL',
          entityLabel: 'Platform-wide promotion kill switch',
          previousState: `${affected.length} live or scheduled`,
          newState: 'All paused immediately',
          reason: 'Emergency stop triggered from promotions governance'
        };
        effects.notify = [
        {
          title: 'All promotions disabled',
          detail: `${affected.length} promotions were stopped platform-wide. Guests mid-checkout keep their applied discount.`,
          channel: 'Internal',
          link: '/os/promotions'
        }];

        break;
      }

    case 'dispute.decide':{
        const target = state.disputes.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          disputes: state.disputes.map((row) =>
          row.id === action.id ?
          {
            ...row,
            status: action.outcome,
            resolution: action.note,
            history: [...row.history, { at, note: `${action.outcome} — ${action.note}` }]
          } :
          row
          )
        };
        effects.audit = {
          action: `Dispute ${action.outcome.toLowerCase()}`,
          entityType: 'Dispute',
          entityId: target.reference,
          entityLabel: `${target.kind} · ${target.bookingId}`,
          previousState: target.status,
          newState: action.amount ? `${action.outcome} · ₹${action.amount.toLocaleString('en-IN')}` : action.outcome,
          reason: action.note
        };
        effects.notify = [
        {
          title: `Dispute ${action.outcome.toLowerCase()}`,
          detail: `${target.reference} (${target.kind}) — ${action.note}`,
          channel: target.party === 'Partner' ? 'Partner' : 'Customer',
          link: '/os/disputes'
        }];

        if (action.outcome === 'Resolved' && action.amount) {
          effects.event = {
            id: uid('EVT'),
            kind: 'Refund Request',
            propertyName: target.propertyName,
            city: '—',
            guestName: target.raisedBy,
            reference: target.bookingId,
            amount: action.amount,
            at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        }
        break;
      }

    case 'dispute.escalate':{
        const target = state.disputes.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          disputes: state.disputes.map((row) =>
          row.id === action.id ?
          {
            ...row,
            status: 'Escalated',
            assignedTo: action.assignedTo,
            history: [...row.history, { at, note: `Escalated to ${action.assignedTo}` }]
          } :
          row
          )
        };
        effects.audit = {
          action: 'Escalate dispute',
          entityType: 'Dispute',
          entityId: target.reference,
          entityLabel: `${target.kind} · ${target.bookingId}`,
          previousState: target.status,
          newState: `Escalated · assigned to ${action.assignedTo}`,
          reason: 'Case requires a leadership decision'
        };
        effects.notify = [
        {
          title: 'Dispute escalated',
          detail: `${target.reference} assigned to ${action.assignedTo}.`,
          channel: 'Internal',
          link: '/os/disputes'
        }];

        break;
      }

    case 'risk.setStatus':{
        const target = state.risks.find((row) => row.id === action.id);
        if (!target) break;
        const score = action.status === 'Cleared' ? Math.min(target.score, 30) : target.score;
        next = {
          ...state,
          risks: state.risks.map((row) =>
          row.id === action.id ?
          { ...row, status: action.status, note: action.note ?? row.note, score, band: bandFor(score) } :
          row
          )
        };
        effects.audit = {
          action: `Risk ${action.status.toLowerCase()}`,
          entityType: target.type,
          entityId: target.id,
          entityLabel: target.name,
          previousState: `${target.status} · score ${target.score} (${target.band})`,
          newState: `${action.status} · score ${score} (${bandFor(score)})`,
          reason: action.note || 'Risk desk decision'
        };
        if (action.status === 'Blocked') {
          effects.notify = [
          {
            title: `${target.type} blocked`,
            detail: `${target.name} was blocked. Open bookings cancelled and linked devices denied sign-in.`,
            channel: target.type === 'Hotel' ? 'Partner' : 'Customer',
            link: '/os/risk'
          }];

        }
        break;
      }

    case 'compliance.setCheck':{
        const target = state.compliance.find((row) => row.propertyId === action.propertyId);
        if (!target) break;
        next = {
          ...state,
          compliance: state.compliance.map((row) =>
          row.propertyId === action.propertyId ?
          {
            ...row,
            [action.check]: action.state,
            notes: action.reason ? [...row.notes, `${at} — ${String(action.check)}: ${action.reason}`] : row.notes
          } :
          row
          ) as ComplianceRecordLive[]
        };
        effects.audit = {
          action: `${action.state === 'Verified' ? 'Approve' : 'Reject'} ${String(action.check).toUpperCase()}`,
          entityType: 'Compliance',
          entityId: target.propertyId,
          entityLabel: `${target.propertyName} · ${target.partnerName}`,
          previousState: String(target[action.check]),
          newState: action.state,
          reason: action.reason || 'Verification reviewed by the compliance desk'
        };
        effects.notify = [
        {
          title: `${String(action.check).toUpperCase()} ${action.state.toLowerCase()}`,
          detail: `${target.partnerName} notified for ${target.propertyName}.${action.reason ? ` Reason: ${action.reason}` : ''}`,
          channel: 'Partner',
          link: '/os/compliance'
        }];

        break;
      }

    case 'compliance.requestDocuments':{
        const target = state.compliance.find((row) => row.propertyId === action.propertyId);
        if (!target) break;
        next = {
          ...state,
          compliance: state.compliance.map((row) =>
          row.propertyId === action.propertyId ?
          {
            ...row,
            requestedDocuments: [...row.requestedDocuments, action.documents],
            notes: [...row.notes, `${at} — requested ${action.documents}`]
          } :
          row
          )
        };
        effects.audit = {
          action: 'Request documents',
          entityType: 'Compliance',
          entityId: target.propertyId,
          entityLabel: target.propertyName,
          previousState: `${target.requestedDocuments.length} open requests`,
          newState: `${target.requestedDocuments.length + 1} open requests · ${action.documents}`,
          reason: action.note || 'Documents required to keep the listing live'
        };
        effects.notify = [
        {
          title: 'Documents requested',
          detail: `${target.partnerName} asked for ${action.documents}. ${action.note}`,
          channel: 'Partner',
          link: '/os/compliance'
        }];

        break;
      }

    case 'compliance.setStage':{
        const target = state.compliance.find((row) => row.propertyId === action.propertyId);
        if (!target) break;
        next = {
          ...state,
          compliance: state.compliance.map((row) =>
          row.propertyId === action.propertyId ? { ...row, stage: action.stage } : row
          ),
          visibility:
          action.stage === 'Suspended' ?
          state.visibility.map((row) =>
          row.propertyId === action.propertyId ?
          { ...row, state: 'Offline' as VisibilityState, reason: 'Suspended by compliance', since: at } :
          row
          ) :
          state.visibility
        };
        effects.audit = {
          action: `Hotel ${action.stage === 'Live' ? 'approved' : action.stage.toLowerCase()}`,
          entityType: 'Hotel',
          entityId: target.propertyId,
          entityLabel: target.propertyName,
          previousState: target.stage,
          newState: action.stage,
          reason: action.reason || 'Compliance stage change'
        };
        effects.notify = [
        {
          title: `${target.propertyName} ${action.stage === 'Live' ? 'approved' : action.stage.toLowerCase()}`,
          detail:
          action.stage === 'Live' ?
          'The hotel is approved and can accept bookings.' :
          'Platform access restricted. The partner has been notified.',
          channel: 'Partner',
          link: '/os/compliance'
        }];

        break;
      }

    case 'pricing.override':{
        const target = state.pricingRules.find((row) => row.id === action.id);
        if (!target) break;
        const effective =
        action.overrideType === 'Fixed rate' ?
        action.value :
        action.overrideType === 'Rate ceiling' ?
        Math.min(target.effectiveRate, action.value) :
        Math.max(target.effectiveRate, action.value);
        next = {
          ...state,
          pricingRules: state.pricingRules.map((row) =>
          row.id === action.id ?
          {
            ...row,
            effectiveRate: effective,
            status: 'Active',
            override: { type: action.overrideType, value: action.value, reason: action.reason, by: actor.name, at }
          } :
          row
          )
        };
        effects.audit = {
          action: 'Override pricing',
          entityType: 'Pricing rule',
          entityId: target.id,
          entityLabel: `${target.propertyName} · ${target.name}`,
          previousState: `₹${target.effectiveRate} effective`,
          newState: `₹${effective} effective · ${action.overrideType}`,
          reason: action.reason
        };
        effects.notify = [
        {
          title: 'Pricing override applied',
          detail: `${target.propertyName} — ${action.overrideType} of ₹${action.value}. Partner dynamic rules are ignored while active.`,
          channel: 'Partner',
          link: '/os/pricing-governance'
        }];

        break;
      }

    case 'pricing.setStatus':{
        const target = state.pricingRules.find((row) => row.id === action.id);
        if (!target) break;
        next = {
          ...state,
          pricingRules: state.pricingRules.map((row) => row.id === action.id ? { ...row, status: action.status } : row)
        };
        effects.audit = {
          action: `Pricing rule → ${action.status}`,
          entityType: 'Pricing rule',
          entityId: target.id,
          entityLabel: `${target.propertyName} · ${target.name}`,
          previousState: target.status,
          newState: action.status,
          reason: action.reason || 'Pricing governance decision'
        };
        break;
      }

    case 'pricing.guardrails':{
        next = { ...state, guardrails: { ...state.guardrails, ...action.patch } };
        effects.audit = {
          action: 'Update pricing guardrails',
          entityType: 'Platform setting',
          entityId: 'pricing.guardrails',
          entityLabel: 'Minimum and maximum price enforcement',
          previousState: `floor ${state.guardrails.floorEnabled ? `₹${state.guardrails.floor}` : 'off'} · ceiling ${
          state.guardrails.ceilingEnabled ? `${state.guardrails.ceiling}×` : 'off'}`,

          newState: `floor ${next.guardrails.floorEnabled ? `₹${next.guardrails.floor}` : 'off'} · ceiling ${
          next.guardrails.ceilingEnabled ? `${next.guardrails.ceiling}×` : 'off'}`,

          reason: 'Guardrails changed from pricing governance'
        };
        break;
      }

    case 'notification.read':
      next = {
        ...state,
        notifications: state.notifications.map((row) => row.id === action.id ? { ...row, read: action.read } : row)
      };
      break;

    case 'notification.archive':
      next = {
        ...state,
        notifications: state.notifications.map((row) =>
        row.id === action.id ? { ...row, archived: true, read: true } : row
        )
      };
      break;

    case 'notification.readAll':
      next = { ...state, notifications: state.notifications.map((row) => ({ ...row, read: true })) };
      break;

    case 'super.execute':{
        next = state;
        if (action.actionId === 'force-offline' || action.actionId === 'force-online' || action.actionId === 'reset-status') {
          const to: VisibilityState = action.actionId === 'force-offline' ? 'Offline' : 'Live';
          next = {
            ...next,
            visibility: next.visibility.map((row) =>
            action.target.startsWith(row.propertyName) ?
            { ...row, state: to, since: to === 'Live' ? '—' : at, days: 0, reason: action.reason } :
            row
            )
          };
        }
        if (action.actionId === 'freeze-payouts') {
          next = {
            ...next,
            settlements: next.settlements.map((row) =>
            action.target.includes(row.partnerName) && row.status !== 'Processed' ?
            { ...row, status: 'On Hold', holdReason: action.reason } :
            row
            )
          };
        }
        if (action.actionId === 'disable-promotions') {
          next = {
            ...next,
            promotions: next.promotions.map((row) => row.status === 'Active' ? { ...row, status: 'Paused' } : row)
          };
        }
        if (action.actionId === 'suspend-hotel' || action.actionId === 'disable-partner') {
          next = {
            ...next,
            compliance: next.compliance.map((row) =>
            action.target.startsWith(row.propertyName) || action.target.includes(row.partnerName) ?
            { ...row, stage: 'Suspended' } :
            row
            ),
            visibility: next.visibility.map((row) =>
            action.target.startsWith(row.propertyName) || action.target.includes(row.partnerName) ?
            { ...row, state: 'Offline' as VisibilityState, reason: action.reason, since: at } :
            row
            )
          };
        }
        effects.audit = {
          action: action.label,
          entityType: 'Platform override',
          entityId: action.actionId,
          entityLabel: action.target,
          previousState: 'Pre-override state captured',
          newState: `${action.label} executed platform-wide`,
          reason: action.reason
        };
        effects.notify = [
        {
          title: action.label,
          detail: `${action.target} — executed by ${actor.name}. Reason: ${action.reason}`,
          channel: 'Internal',
          link: '/os/control-center'
        }];

        break;
      }

    case 'events.push':
      next = { ...state, events: [action.event, ...state.events].slice(0, 80) };
      break;

    case 'audit.record':
      effects.audit = action.entry;
      break;

    default:
      break;
  }

  if (effects.audit) {
    const record: OsAuditRecord = {
      id: uid('AUD'),
      ...effects.audit,
      adminName: actor.name,
      adminEmail: actor.email,
      role: actor.role,
      at,
      iso,
      ip: actor.ip
    };
    next = { ...next, audit: [record, ...next.audit].slice(0, 400) };
  }

  if (effects.notify?.length) {
    const created: OsNotification[] = effects.notify.map((item) => ({
      id: uid('NTF'),
      ...item,
      at,
      iso,
      read: false,
      archived: false
    }));
    next = { ...next, notifications: [...created, ...next.notifications].slice(0, 200) };
  }

  if (effects.event) {
    next = { ...next, events: [effects.event, ...next.events].slice(0, 80) };
  }

  return next;
}

/* -------------------------------------------------------------- persistence */

const STORAGE_KEY = 'checkdin-adminos-state-v1';

export function hydrate(): AdminOsState {
  const seed = seedState();
  if (typeof window === 'undefined') return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const stored = JSON.parse(raw) as Partial<AdminOsState>;
    return { ...seed, ...stored };
  } catch {
    return seed;
  }
}

export function persist(state: AdminOsState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {

    /* storage full — state stays in memory for this session */}
}

export function resetPersisted() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
}

/** Stable pseudo IP per browser session, recorded on every audit entry. */
export function sessionIp(): string {
  const key = 'checkdin-session-ip';
  if (typeof window === 'undefined') return '0.0.0.0';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const ip = `49.36.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 200) + 10}`;
  window.localStorage.setItem(key, ip);
  return ip;
}