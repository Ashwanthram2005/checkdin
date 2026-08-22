import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircleIcon,
  BedDoubleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MoonIcon,
  ShieldCheckIcon,
  SunIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Field';
import { RoleSelector } from '../components/auth/RoleSelector';
import { DemoAccounts } from '../components/auth/DemoAccounts';
import { ControlCenterHero } from '../components/auth/ControlCenterHero';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getRole, securityFeatures, type RoleId } from '../data/roles';

export function Login() {
  const navigate = useNavigate();
  const { user, signIn, signInAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [roleId, setRoleId] = useState<RoleId>('super');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoBusy, setDemoBusy] = useState<RoleId | null>(null);

  const role = getRole(roleId);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  function fillRole(next: RoleId) {
    const target = getRole(next);
    setRoleId(next);
    setEmail(target.email);
    setPassword(target.password);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      setError('Enter both your email address and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.ok) navigate('/', { replace: true });else
    setError(result.message ?? 'We could not sign you in.');
  }

  async function handleDemo(next: RoleId) {
    setDemoBusy(next);
    setError(null);
    await signInAsDemo(next);
    setDemoBusy(null);
    navigate('/', { replace: true });
  }

  return (
    <div className="grid min-h-full w-full grid-cols-1 bg-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-14 lg:py-10">
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-ink">
                <BedDoubleIcon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-extrabold tracking-tight text-ink">CHECKDIN</p>
                <p className="text-[11px] text-muted">Admin Control Center</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-lg border border-line bg-card p-2 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
              
              {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="mt-10">
            
            <h1 className="text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted">Sign in to access your dashboard.</p>

            <div className="mt-7">
              <RoleSelector value={roleId} onChange={fillRole} />
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder={role.email}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)} />
                
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-[13px] font-medium text-ink underline-offset-2 hover:underline">
                    
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-11"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)} />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-faint hover:text-ink">
                    
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex w-fit cursor-pointer items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-line text-accent focus:ring-0" />
                
                Remember me on this device
              </label>

              {error ?
              <p
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-negative/30 bg-negative/10 px-3 py-2.5 text-[13px] text-negative">
                
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </p> :
              null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={LockIcon}
                disabled={submitting}
                className="w-full">
                
                {submitting ? 'Verifying…' : 'Secure login'}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Protected by RBAC, encrypted sessions, and full activity logging.
              </p>
            </form>

            <div className="mt-8">
              <DemoAccounts onUse={fillRole} onLogin={handleDemo} busyRole={demoBusy} />
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {securityFeatures.map((feature) =>
              <li key={feature.label} className="flex items-start gap-2">
                  <ShieldCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  <span>
                    <span className="block text-xs font-semibold text-ink">{feature.label}</span>
                    <span className="block text-[11px] text-muted">{feature.detail}</span>
                  </span>
                </li>
              )}
            </ul>
          </motion.main>

          <footer className="mt-10 text-xs text-muted">
            © 2026 Checkdin Technologies · Terms · Privacy · Security
          </footer>
        </div>
      </div>

      <ControlCenterHero />
    </div>);

}