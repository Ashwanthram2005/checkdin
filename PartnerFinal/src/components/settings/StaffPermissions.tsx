import React, { useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Field, Select, TextInput } from './FormField';
import { GuestAvatar } from '../StatusBadge';
import { OwnerRequiredBadge } from '../AccessControls';
import { useAuth } from '../../contexts/AuthContext';
import type { StaffUser } from '../../data/auth';

const emptyDraft = { name: '', phone: '', roleId: 'receptionist', password: '1234' };

export function StaffPermissions() {
  const { users, setUsers, roles, isOwner, addAudit } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const roleName = (roleId: string) => roles.find((role) => role.id === roleId)?.name ?? 'Staff';

  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  };

  const openEdit = (member: StaffUser) => {
    setEditingId(member.id);
    setDraft({
      name: member.name,
      phone: member.phone,
      roleId: member.roleId,
      password: member.password
    });
    setFormOpen(true);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;

    if (editingId) {
      setUsers((prev) =>
      prev.map((member) => member.id === editingId ? { ...member, ...draft } : member)
      );
      addAudit({
        action: 'Updated staff member',
        detail: `${draft.name} • ${roleName(draft.roleId)}`,
        category: 'Security'
      });
    } else {
      setUsers((prev) => [
      ...prev,
      {
        id: `u${Date.now()}`,
        name: draft.name.trim(),
        roleId: draft.roleId,
        password: draft.password || '1234',
        phone: draft.phone,
        active: true,
        lastLogin: 'Never signed in'
      }]
      );
      addAudit({
        action: 'Added staff member',
        detail: `${draft.name} • ${roleName(draft.roleId)}`,
        category: 'Security'
      });
    }

    setFormOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const changeRole = (member: StaffUser, roleId: string) => {
    setUsers((prev) =>
    prev.map((item) => item.id === member.id ? { ...item, roleId } : item)
    );
    addAudit({
      action: 'Changed staff role',
      detail: `${member.name} → ${roleName(roleId)}`,
      category: 'Security'
    });
  };

  const removeMember = (member: StaffUser) => {
    setUsers((prev) => prev.filter((item) => item.id !== member.id));
    addAudit({ action: 'Deleted staff account', detail: member.name, category: 'Security' });
  };

  return (
    <SettingsCard
      title="Staff members"
      description={`${users.length} people can sign in to this property`}
      bodyClassName=""
      action={
      isOwner ?
      <button
        type="button"
        onClick={openAdd}
        className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
        
            <PlusIcon size={15} aria-hidden="true" />
            Add staff member
          </button> :

      <OwnerRequiredBadge label="Owner manages staff" />

      }>
      
      {formOpen && isOwner &&
      <form onSubmit={submit} className="border-b border-neutral-100 bg-neutral-50/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13.5px] font-semibold text-ink">
              {editingId ? 'Edit staff member' : 'New staff member'}
            </h3>
            <button
            type="button"
            aria-label="Close form"
            onClick={() => setFormOpen(false)}
            className="rounded-md p-1 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-200/60 hover:text-ink">
            
              <XIcon size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Field id="staffName" label="Full name">
              <TextInput
              id="staffName"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Anita Joseph"
              required />
            
            </Field>
            <Field id="staffPhone" label="Phone number">
              <TextInput
              id="staffPhone"
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              placeholder="+91 98400 00000" />
            
            </Field>
            <Field id="staffRole" label="Role">
              <Select
              id="staffRole"
              value={draft.roleId}
              onChange={(e) => setDraft({ ...draft, roleId: e.target.value })}>
              
                {roles.
              filter((role) => role.level !== 'owner').
              map((role) =>
              <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
              )}
              </Select>
            </Field>
            <Field id="staffPassword" label="Temporary password" hint="Staff can change it later.">
              <TextInput
              id="staffPassword"
              value={draft.password}
              onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
            
            </Field>
          </div>

          <div className="mt-4 flex gap-2">
            <button
            type="submit"
            className="rounded-lg bg-lime-300 px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
            
              {editingId ? 'Save changes' : 'Create account'}
            </button>
            <button
            type="button"
            onClick={() => setFormOpen(false)}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
            
              Cancel
            </button>
          </div>
        </form>
      }

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-neutral-50/60">
              {['Member', 'Role', 'Phone', 'Last login', ''].map((head, i) =>
              <th
                key={head || i}
                scope="col"
                className="px-5 py-2.5 text-[12px] font-medium text-ink-muted">
                
                  {head}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((member) => {
              const isOwnerAccount = roles.find((role) => role.id === member.roleId)?.level === 'owner';
              return (
                <tr
                  key={member.id}
                  className="border-b border-neutral-100 transition-colors duration-150 ease-out last:border-0 hover:bg-neutral-50/70">
                  
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-3">
                      <GuestAvatar name={member.name} />
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-medium text-ink">
                          {member.name}
                        </span>
                        <span className="block text-[12px] text-ink-muted">
                          {member.active ? 'Active account' : 'Disabled'}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {isOwner && !isOwnerAccount ?
                    <Select
                      aria-label={`Role for ${member.name}`}
                      value={member.roleId}
                      onChange={(e) => changeRole(member, e.target.value)}
                      className="py-1.5 text-[13px]">
                      
                        {roles.
                      filter((role) => role.level !== 'owner').
                      map((role) =>
                      <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                      )}
                      </Select> :

                    <span className="inline-flex rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                        {roleName(member.roleId)}
                      </span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-ink-soft">{member.phone}</td>
                  <td className="px-5 py-3.5 text-[13px] text-ink-muted">{member.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${member.name}`}
                        onClick={() => openEdit(member)}
                        disabled={!isOwner}
                        className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-ink disabled:opacity-30">
                        
                        <PencilIcon size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${member.name}`}
                        onClick={() => removeMember(member)}
                        disabled={!isOwner || isOwnerAccount}
                        title={isOwner ? undefined : 'Owner Permission Required'}
                        className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600 disabled:opacity-30">
                        
                        <Trash2Icon size={15} aria-hidden="true" />
                      </button>
                    </span>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </SettingsCard>);

}