import React, { useState } from 'react';
import { PortalLanding } from './onboarding/PortalLanding';
import { ListProperty } from './onboarding/ListProperty';
import { Login } from './Login';

type PortalView = 'landing' | 'login' | 'list';

export function PartnerPortal() {
  const [view, setView] = useState<PortalView>('landing');

  if (view === 'login') return <Login onExit={() => setView('landing')} />;
  if (view === 'list') return <ListProperty onBack={() => setView('landing')} />;

  return <PortalLanding onLogin={() => setView('login')} onList={() => setView('list')} />;
}