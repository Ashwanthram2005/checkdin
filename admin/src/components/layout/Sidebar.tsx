import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOutIcon, XIcon } from 'lucide-react';
import { getNavigationForRole, navigation } from '../../data/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

export function SidebarContent({ onNavigate }: {onNavigate?: () => void;}) {
  const navigateTo = useNavigate();
  const { user, role, signOut } = useAuth();
  const groups = role ? getNavigationForRole(role.nav) : navigation;

  function handleSignOut() {
    signOut();
    navigateTo('/login', { replace: true });
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-ink">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v7" strokeLinecap="round" />
            <path d="M6.5 6.5a7.5 7.5 0 1 0 11 0" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-sidebar-ink">CHECKDIN</p>
          <p className="text-[11px] text-sidebar-muted">Platform Console</p>
        </div>
      </div>

      {role ?
      <div className="mx-2.5 mb-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: role.accentSoft, color: role.accent }}>
            
              <role.icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-sidebar-ink">{user?.name}</p>
              <p className="truncate text-[11px] text-sidebar-muted">{role.name}</p>
            </div>
          </div>
        </div> :
      null}

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2.5 pb-4">
        {groups.map((group) =>
        <div key={group.label} className="mb-4">
            <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted/70">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) =>
            <li key={item.to}>
                  <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                cn(
                  'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-150 ease-smooth',
                  isActive ?
                  'bg-accent font-semibold text-accent-ink' :
                  'font-medium text-sidebar-muted hover:bg-white/5 hover:text-sidebar-ink'
                )
                }>
                
                    {({ isActive }) =>
                <>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.badge ?
                  <span
                    className={cn(
                      'ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                      isActive ? 'bg-accent-ink/10 text-accent-ink' : 'bg-white/10 text-sidebar-ink'
                    )}>
                    
                            {item.badge}
                          </span> :
                  null}
                      </>
                }
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-line px-2.5 py-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-sidebar-muted transition-colors duration-150 ease-smooth hover:bg-white/5 hover:text-sidebar-ink">
          
          <LogOutIcon className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>);

}

export function Sidebar({ open, onClose }: {open: boolean;onClose: () => void;}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-sidebar-line lg:block">
        <SidebarContent />
      </aside>

      {open ?
      <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-[264px] border-r border-sidebar-line">
            <button
            onClick={onClose}
            aria-label="Close navigation"
            className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-sidebar-muted hover:bg-white/10 hover:text-sidebar-ink">
            
              <XIcon className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div> :
      null}
    </>);

}