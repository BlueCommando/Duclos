import appSettings from '@/assets/appSettings';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-simple-toast';
import { create } from 'zustand';
import { messageFormat } from '../app/Chat';

export type chatLogs = {
  name: string,
  logs: messageFormat[],
}[];

export type chatLogStore = {
  chatLogs: chatLogs,
  saveChatLogs: (newChatLogs: chatLogs) => Promise<void>,
  loadChatLogs: () => Promise<chatLogs>,
}

export const useChatLogStore = create<chatLogStore>((set) => ({
  chatLogs: [],

  saveChatLogs: async (newChatLogs: chatLogs) => {
    try{
      await EncryptedStorage.setItem(
        appSettings.user.userChatLogsAsyncKey,
        JSON.stringify(newChatLogs)
      );
      
      set({chatLogs: newChatLogs});

      console.log("Successfully saved chatlogs!");
    } catch(e) {
      Toast.show("Failed to save Chatlogs. Try Again later.", 3000)
      throw new Error("Error while trying to save chatLogs: " + e);
    }
  },

  loadChatLogs: async () => {
    try{
      const session = await EncryptedStorage.getItem(appSettings.user.userChatLogsAsyncKey);

      if (session !== null){
        const chat: chatLogs = JSON.parse(session);
        set({chatLogs: chat});
        return chat;
      }

      return [];
    } catch(e) {
      Toast.show("Failed to load Chatlogs. Try Again later.", 3000)
      throw new Error("Error while trying to get chatLogs: " + e);
    }
  }
}));
