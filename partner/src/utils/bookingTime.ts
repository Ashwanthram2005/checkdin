export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor(safe % 3600 / 60);
  const seconds = safe % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
}

export function countdownTone(totalSeconds: number): 'critical' | 'warning' | 'calm' {
  if (totalSeconds <= 1800) return 'critical';
  if (totalSeconds <= 7200) return 'warning';
  return 'calm';
}