import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppTheme {
  isDark: boolean;
  bg: string;
  surface: string;
  surfaceSecondary: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  headerBg: string;
  toolbarBg: string;
  divider: string;
  cardBg: string;
  statusBarStyle: 'light' | 'dark';
}

export const LIGHT_THEME: AppTheme = {
  isDark: false,
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceBorder: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#0284C7',
  primaryLight: '#E0F2FE',
  headerBg: '#FFFFFF',
  toolbarBg: '#FFFFFF',
  divider: '#E2E8F0',
  cardBg: '#F8FAFC',
  statusBarStyle: 'dark',
};

export const DARK_THEME: AppTheme = {
  isDark: true,
  bg: '#0B0F19',
  surface: '#111827',
  surfaceSecondary: '#1F2937',
  surfaceBorder: '#374151',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  primary: '#38BDF8',
  primaryLight: '#1E293B',
  headerBg: '#111827',
  toolbarBg: '#111827',
  divider: '#374151',
  cardBg: '#1F2937',
  statusBarStyle: 'light',
};

export const THEME_STORAGE_KEY = '@easy_doodle_theme_mode';

export async function getStoredThemeMode(): Promise<ThemeMode> {
  try {
    const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeMode;
    }
  } catch (e) {
    console.error('Error loading stored theme mode:', e);
  }
  return 'system';
}

export async function storeThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (e) {
    console.error('Error saving theme mode:', e);
  }
}

