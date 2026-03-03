import AsyncStorage from "@react-native-async-storage/async-storage";
import appSettings from '@/assets/appSettings';

class downloadCheckService{
  // AI Model:

  /** 
   * Sets the value of the user's AI model files state. 
   * 
   * Returns **false** if **null**.
   * 
   * **(BOOLEAN TYPE)**
  */
  async setDownloadedAiModel(state: boolean){
    try{

      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(appSettings.ai.fullyDownloadedAiModelAsyncKey, jsonValue);
      console.log(`saved in 'setDownloadedAiModel': '${state}'`);

    } catch(e){

      console.log("setDownloadedAiModel Error:", e);

    }
  }

  /** 
   * Returns if the user has fully downloaded the 
   * AI model from their local storage data.
  */
  async fullyDownloadedAiModel(): Promise<boolean> {
    try{

      const state = await AsyncStorage.getItem(appSettings.ai.fullyDownloadedAiModelAsyncKey);

      if (state === null){
        return false;
      }

      console.log(`retrived from 'setDownloadedAiModel': '${state}'`);
      return JSON.parse(state);

    } catch(e){

      console.log("fullyDownloadedAiModel Error:", e);
      return false;

    }
  }

  // AI Models Multimodal Projector:
  
  /** 
   * Sets the value of the user's AI model's Multimodal Projector files state.
   *  
   * Returns **false** if **null**.
   * 
   * **(BOOLEAN TYPE)**
  */
  async setDownloadedMMProj(state: boolean){
    try{

      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(appSettings.ai.fullyDownloadedMMProjAsyncKey, jsonValue);
      console.log(`saved in 'setDownloadedAiModel': '${state}'`);

    } catch(e){

      console.log("setDownloadedAiModel Error:", e);

    }
  }

  /** 
   * Returns if the user has fully downloaded the 
   * AI model's Multimodal Projector from their local storage data.
  */
  async fullyDownloadedMMProj(): Promise<boolean> {
    try{

      const state = await AsyncStorage.getItem(appSettings.ai.fullyDownloadedMMProjAsyncKey);

      if (state === null){
        return false;
      }

      console.log(`retrived from 'setDownloadedAiModel': '${state}'`);
      return JSON.parse(state);

    } catch(e){

      console.log("fullyDownloadedAiModel Error:", e);
      return false;

    }
  }
}

export default new downloadCheckService
