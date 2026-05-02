import appSettings from '@/assets/appSettings';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-simple-toast';
import { create } from 'zustand';

export type userSettings = {
  prepromptedMessage?: string,
  conversationContext: boolean,
  systemCompletion: boolean,
}

export const defaultUserSettings: userSettings = {
  conversationContext: false,
  systemCompletion: true,
}

export type settingsStore = {
  settings: userSettings,
  loaded: boolean,
  saveUserSettings: (settings: userSettings) => Promise<void>,
  loadUserSettings: () => Promise<userSettings>,
}

export const useSettingsStore = create<settingsStore>((set) => ({
  settings: defaultUserSettings,
  loaded: false,

  saveUserSettings: async (newSettings: userSettings) => {
    try{
      await EncryptedStorage.setItem(
        appSettings.settings.userSettingsAsyncKey,
        JSON.stringify(newSettings)
      );
        
      set({settings: newSettings});

      console.log("Successfully saved settings!");
    } catch(e) {
      Toast.show("Failed to save Settings. Try Again later.", 3000)
      console.log("Error while trying to save settings:", e);
    }
  },

  loadUserSettings: async () => {
    try{
      const session = await EncryptedStorage.getItem(appSettings.settings.userSettingsAsyncKey);

      if (session !== null){
        const settings: userSettings = JSON.parse(session);
        set({settings: settings, loaded: true});
        return settings;
      }

      return defaultUserSettings;
    } catch(e) {
      Toast.show("Failed to load Settings. Try Again later.", 3000)
      throw new Error(`Error while trying to get chatLogs: ${e}`)
    }
  }
}));
