
import { useState, useEffect } from 'react';

interface Preferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  messageDisplay: 'compact' | 'comfortable';
  soundEnabled: boolean;
  desktopNotifications: boolean;
  threadCollapsed: boolean;
  mentionNotifications: boolean;
}

const defaultPreferences: Preferences = {
  theme: 'light',
  fontSize: 'medium',
  messageDisplay: 'comfortable',
  soundEnabled: true,
  desktopNotifications: true,
  threadCollapsed: false,
  mentionNotifications: true
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const saved = localStorage.getItem('preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences]);

  return { preferences, setPreferences };
}
