import {themesOptions} from '@/theme/themeOptions';
import {Direction, PaletteMode} from '@mui/material';
import {createContext, ReactNode, useEffect, useState} from 'react';

import channelsettings from '../../mocks/styles/channel-example.json';

// ============================================================
export type SettingsContextType = {
  settings: SettingsOptions,
  toggleDirection: () => void,
  toggleMode: () => void,
  switchTheme: (arg: string) => void,
  updateSettings: (arg: SettingsOptions) => void
}
export type LayoutType = {
  bgColor: string,
  borderTop?: string,
  borderBottom?: string,
  borderColor?: string,
  color: string,
  elevation?: number,
  fontSize?: number,
  height?: number,
  minHeight?: number,
  maxHeight?: number,
  maxWidth: string,
  mobileHeight?: number,
  mt: number,
  mb: number,
  pt: number,
  pb: number,
  show: boolean
}
export type ChannelLayoutsType = {
  maxPageWidth?: string,
  maxContainerWidth?: string,
  origin: string;
  topbar?: LayoutType,
  headerbar?: LayoutType,
  navbar?: LayoutType,
  footer?: LayoutType,
  mobilenavbar?: LayoutType
}
export type ChannelThemesType = {dark?: any, light?: any, palette?: any, typography?: any, breakpoints?: any};
export type SettingsOptions = {
  channelId: string,
  direction: Direction,
  mode: PaletteMode,
  layouts: ChannelLayoutsType,
  themes: ChannelThemesType,
  channelConfigs: any,
  selectedTheme?: string
};
type settingsProviderProps = {children?: ReactNode};
// ============================================================

// ============================================================
// ============================================================
export const SettingsContext = createContext<SettingsContextType | null>(null);

// SET "rtl" OR "ltr" HERE
// THEN GOTO BROWSER CONSOLE AND RUN localStorage.clear() TO CLEAR LOCALSTORAGE
const initialLayouts: ChannelLayoutsType = {origin: 'app', ...channelsettings.layouts};
const initialSettings: SettingsOptions = {
  channelId: '',
  direction: 'ltr',
  mode: 'light',
  layouts: initialLayouts,
  themes: {},
  channelConfigs: {},
};

const SettingsProvider = ({children}: settingsProviderProps) => {
  const [settings, setSettings] = useState(initialSettings);

  const updateSettings = (updatedSettings: SettingsOptions) => {
    setSettings(updatedSettings);
    window.localStorage.setItem(
      'channel_settings',
      JSON.stringify(updatedSettings),
    );
  };

  const switchTheme = (themeName: string) => {
    const newTheme = themesOptions[themeName];
    updateSettings({...settings, ...{themes: newTheme, selectedTheme: themeName}});
  };

  const toggleDirection = () => {
    const direction = settings.direction === 'rtl' ? 'ltr' : 'rtl';
    updateSettings({...settings, ...{direction}});
  };

  const toggleMode = () => {
    const mode = settings.mode === 'dark' ? 'light' : 'dark';
    updateSettings({...settings, ...{mode}});
  };

  useEffect(() => {
    if (!window) return null;
    const getItem = window.localStorage.getItem('channel_settings');
    if (getItem) setSettings(JSON.parse(getItem));
  }, []);

  return (
    <SettingsContext.Provider value={{settings, toggleDirection, toggleMode, switchTheme, updateSettings}}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
