import AsyncStorage from "@react-native-async-storage/async-storage";
import appSettings from '@/assets/appSettings';

class downloadCheckService{
  // AI Model:

  /** 
   * Sets the value of the user's AI model files state. 
   * **(BOOLEAN TYPE)**
  */
  async setDownloadedAiModel(state: boolean){
    try{

      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(appSettings.ai.fullyDownloadedAiModelAsyncKey, jsonValue);

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

      return JSON.parse(state);

    } catch(e){

      console.log("fullyDownloadedAiModel Error:", e);
      return false;

    }
  }

  // AI Models Multimodal Projector:
  
  /** 
   * Sets the value of the user's AI model's Multimodal Projector files state.
   * **(BOOLEAN TYPE)**
  */
  async setDownloadedMMProj(state: boolean){
    try{

      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(appSettings.ai.fullyDownloadedMMProjAsyncKey, jsonValue);

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

      return JSON.parse(state);

    } catch(e){

      console.log("fullyDownloadedAiModel Error:", e);
      return false;

    }
  }

  /** 
   * Marks all downloaded AI files as deleted.
  */
  async markAllFilesDeleted(){
    try{

      this.setDownloadedAiModel(false);
      this.setDownloadedMMProj(false);

    } catch(e) {

      console.log("fullyDownloadedAiModel Error:", e)

    }
  }
}

export default new downloadCheckService
