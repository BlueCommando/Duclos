import appSettings from '@/assets/appSettings';
import EncryptedStorage from 'react-native-encrypted-storage';

export type chatLogs = {
  name: string,
  logs: log[],
}[];

export type log = {
  role: "sender" | "receiver",
  type: "text" | "image",
  time: number,
  content: string,
}

export const getUsersChatLogs = async () => {
  try{
    const session = await EncryptedStorage.getItem(appSettings.user.userChatLogsAsyncKey);

    if (session !== null){
      return JSON.parse(session);
    } else {
      return []
    }
  } catch(e) {
    console.log("Error while trying to get chatLogs:", e)
  }
}

export const saveUsersChatLogs = async (chat: chatLogs) => {
  try{
    await EncryptedStorage.setItem(
      appSettings.user.userChatLogsAsyncKey,
      JSON.stringify(chat)
    );
    console.log("Successfully saved chatlogs!")
  } catch(e) {
    console.log("Error while trying to save chatLogs:", e)
  }
}
