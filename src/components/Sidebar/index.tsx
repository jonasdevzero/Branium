import { useCallback, useEffect, useState } from 'react';
import { SidebarSettings, UpdateSettings } from './@types/settings';
import { Options } from './components/Options';
import { Rooms } from './components/Rooms';

import { Container } from './styles';

const settingsName = 'sidebar:settings';

const initialSettings = {
  currentRoomType: 'CONTACT',
} as SidebarSettings;

export const Sidebar: React.FC = () => {
  const [settings, setSettings] = useState<SidebarSettings>(initialSettings);

  useEffect(() => {
    const settingsJson = localStorage.getItem(settingsName);

    if (!settingsJson) {
      localStorage.setItem(settingsName, JSON.stringify(initialSettings));
    } else {
      const persistedSettings = JSON.parse(settingsJson) as SidebarSettings;
      setSettings(persistedSettings);
    }
  }, []);

  const updateSettings = useCallback<UpdateSettings>(
    (callback) => {
      const updatedSettings = callback(settings);

      setSettings(updatedSettings);
      localStorage.setItem(settingsName, JSON.stringify(updatedSettings));
    },
    [settings],
  );

  return (
    <Container>
      <Options
        currentRoomType={settings.currentRoomType}
        updateSettings={updateSettings}
      />

      <Rooms currentRoomType={settings.currentRoomType} />
    </Container>
  );
};
