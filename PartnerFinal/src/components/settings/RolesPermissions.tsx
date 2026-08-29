import React, { useState } from 'react';
import { LockIcon, PencilIcon, PlusIcon, Trash2Icon, UsersIcon, XIcon } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Field, Select, TextInput } from './FormField';
import { OwnerOnly } from '../AccessControls';
import { useAuth } from '../../contexts/AuthContext';
import { ownerOnlyActions, permissionCatalog, type PermissionId, type Role } from '../../data/auth';

const levelChip: Record<Role['level'], string> = {
  owner: 'bg-ink text-white',
  manager: 'bg-blue-50 text-blue-700',
  staff: 'bg-lime-100 text-lime-600'
};

const emptyDraft = { name: '', level: 'staff' as Role['level'], description: '' };

export function RolesPermissions() {
  const { roles, setRoles, users, setUsers, addAudit } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const staffCount = (roleId: string) => users.filter((user) => user.roleId === roleId).length;

  const togglePermission = (roleId: string, permission: PermissionId) => {
    const role = roles.find((item) => item.id === roleId);
    if (!role || role.level === 'owner') return;
    const enabled = role.permissions.includes(permission);
    setRoles((prev) =>
    prev.map((item) =>
    item.id === roleId ?
    {
      ...item,
      permissions: enabled ?
      item.permissions.filter((p) => p !== permission) :
      [...item.permissions, permission]
    } :
    item
    )
    );
    addAudit({
      action: 'Changed permission',
      detail: `${role.name} — ${permissionCatalog.find((p) => p.id === permission)?.label} ${
      enabled ? 'disabled' : 'enabled'}`,

      category: 'Security'
    });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;

    if (editingId) {
      setRoles((prev) =>
      prev.map((role) =>
      role.id === editingId ?
      { ...role, name: draft.name.trim(), level: draft.level, description: draft.description } :
      role
      )
      );
      addAudit({ action: 'Edited role', detail: draft.name.trim(), category: 'Security' });
    } else {
      setRoles((prev) => [
      ...prev,
      {
        id: `role${Date.now()}`,
        name: draft.name.trim(),
        level: draft.level,
        system: false,
        description: draft.description || 'Custom role.',
        permissions: ['view_bookings']
      }]
      );
      addAudit({ action: 'Created role', detail: draft.name.trim(), category: 'Security' });
    }
    setDraft(emptyDraft);
    setEditingId(null);
    setFormOpen(false);
  };

  const deleteRole = (role: Role) => {
    if (role.system) return;
    setRoles((prev) => prev.filter((item) => item.id !== role.id));
    setUsers((prev) =>
    prev.map((user) => user.roleId === role.id ? { ...user, roleId: 'receptionist' } : user)
    );
    addAudit({ action: 'Deleted role', detail: role.name, category: 'Security' });
  };

  return (
    <OwnerOnly
      title="Roles & permissions are managed by the Owner"
      description="Owner Permission Required — you can view your own access in the profile menu.">
      
      <div className="space-y-5">
        <SettingsCard
          title="Roles"
          description={`${roles.length} roles • assign staff and control what each role can do`}
          bodyClassName=""
          action={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft(emptyDraft);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
            
              <PlusIcon size={15} aria-hidden="true" />
              Create role
            </button>
          }>
          
          {formOpen &&
          <form onSubmit={submit} className="border-b border-neutral-100 bg-neutral-50/60 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13.5px] font-semibold text-ink">
                  {editingId ? 'Edit role' : 'New custom role'}
                </h3>
                <button
                type="button"
                aria-label="Close form"
                onClick={() => setFormOpen(false)}
                className="rounded-md p-1 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-200/60 hover:text-ink">
                
                  <XIcon size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field id="roleName" label="Role name">
                  <TextInput
                  id="roleName"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Night Auditor"
                  required />
                
                </Field>
                <Field id="roleLevel" label="Visibility level" hint="Controls audit log access.">
                  <Select
                  id="roleLevel"
                  value={draft.level}
                  onChange={(e) => setDraft({ ...draft, level: e.target.value as Role['level'] })}>
                  
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </Select>
                </Field>
                <Field id="roleDescription" label="Description">
                  <TextInput
                  id="roleDescription"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="What this role is for" />
                
                </Field>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                type="submit"
                className="rounded-lg bg-lime-300 px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                
                  {editingId ? 'Save role' : 'Create role'}
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

          <ul className="divide-y divide-neutral-100">
            {roles.map((role) =>
            <li key={role.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-ink">{role.name}</span>
                    <span
                    className={`rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${levelChip[role.level]}`}>
                    
                      {role.level}
                    </span>
                    {role.system &&
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10.5px] font-semibold text-ink-muted">
                        System
                      </span>
                  }
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-ink-muted">
                    {role.description}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                  <UsersIcon size={13} aria-hidden="true" />
                  {staffCount(role.id)} assigned
                </span>
                <span className="text-[12.5px] text-ink-muted">
                  {role.permissions.length}/{permissionCatalog.length} permissions
                </span>
                <span className="flex items-center gap-1">
                  <button
                  type="button"
                  aria-label={`Edit ${role.name}`}
                  onClick={() => {
                    setEditingId(role.id);
                    setDraft({
                      name: role.name,
                      level: role.level === 'owner' ? 'manager' : role.level,
                      description: role.description
                    });
                    setFormOpen(true);
                  }}
                  disabled={role.level === 'owner'}
                  className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-ink disabled:opacity-30">
                  
                    <PencilIcon size={15} aria-hidden="true" />
                  </button>
                  <button
                  type="button"
                  aria-label={`Delete ${role.name}`}
                  onClick={() => deleteRole(role)}
                  disabled={role.system}
                  className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600 disabled:opacity-30">
                  
                    <Trash2Icon size={15} aria-hidden="true" />
                  </button>
                </span>
              </li>
            )}
          </ul>
        </SettingsCard>

        <SettingsCard
          title="Access matrix"
          description="Enable or disable each permission per role. Owner access cannot be reduced."
          bodyClassName="">
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                  <th scope="col" className="px-5 py-2.5 text-[12px] font-medium text-ink-muted">
                    Permission
                  </th>
                  {roles.map((role) =>
                  <th
                    key={role.id}
                    scope="col"
                    className="w-[120px] px-4 py-2.5 text-center text-[12px] font-medium text-ink-muted">
                    
                      {role.name}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {permissionCatalog.map((permission) =>
                <tr key={permission.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-5 py-3">
                      <p className="text-[13.5px] font-medium text-ink">{permission.label}</p>
                      <p className="mt-0.5 text-[11.5px] text-ink-muted">{permission.group}</p>
                    </td>
                    {roles.map((role) =>
                  <td key={role.id} className="px-4 py-3 text-center">
                        <input
                      type="checkbox"
                      checked={role.permissions.includes(permission.id)}
                      disabled={role.level === 'owner'}
                      onChange={() => togglePermission(role.id, permission.id)}
                      aria-label={`${permission.label} for ${role.name}`}
                      className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-lime-500 disabled:cursor-not-allowed disabled:opacity-50" />
                    
                      </td>
                  )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Owner-only actions"
          description="These cannot be delegated to any role or custom permission."
          bodyClassName="p-5">
          
          <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {ownerOnlyActions.map((action) =>
            <li
              key={action.id}
              className="flex items-center gap-2.5 rounded-xl border border-neutral-200 px-3.5 py-2.5">
              
                <LockIcon size={14} className="shrink-0 text-ink-muted" aria-hidden="true" />
                <span className="text-[13px] text-ink">{action.label}</span>
                <span className="ml-auto rounded-md bg-ink px-2 py-0.5 text-[10.5px] font-semibold text-white">
                  Owner
                </span>
              </li>
            )}
          </ul>
        </SettingsCard>
      </div>
    </OwnerOnly>);

}