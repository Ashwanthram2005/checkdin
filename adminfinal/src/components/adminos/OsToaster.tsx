import React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';

/** Action feedback for every AdminOS mutation, themed with the console tokens. */
export function OsToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      theme={theme === 'dark' ? 'dark' : 'light'}
      closeButton
      duration={3600}
      toastOptions={{
        style: {
          borderRadius: '12px',
          fontSize: '13px'
        }
      }} />);


}