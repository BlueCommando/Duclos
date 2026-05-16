import appSettings from '@/assets/appSettings';
import NetInfo from "@react-native-community/netinfo";
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { CompletionParams, initLlama, LlamaContext, NativeCompletionResult } from 'llama.rn';
import { Alert, BackHandler } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS, { DownloadProgressCallbackResult } from 'react-native-fs';
import AiFileCheck from './AiFileCheck';
import { useSettingsStore } from '../userData/UserSettings';

// Help with llama.rn:
// https://github.com/mybigday/llama.rn/blob/main/README.md
//
// Help with getting AI multimodal projectors:
// https://github.com/ggml-org/llama.cpp/tree/master/tools/mtmd#how-to-obtain-mmproj
//
// Used Model Link:
// https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF

const aiModelName = "aiModel.gguf";
const aiModelDest = `${RNFS.DocumentDirectoryPath}/${aiModelName}`;
const aiModelDownloadLink = "https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/resolve/main/Qwen2.5-VL-7B-Instruct-UD-Q2_K_XL.gguf";

const aiMMProjName = "mmproj.gguf";
const aiMMProjDest = `${RNFS.DocumentDirectoryPath}/${aiMMProjName}`;
const aiMMProjDownloadLink = "https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/resolve/main/mmproj-F16.gguf";

type aiInitProgressFuncs = {
  downloadModel?: (res: DownloadProgressCallbackResult) => void,
  downloadMMProj?: (res: DownloadProgressCallbackResult) => void,
  initModel?: (percentage: number) => void,
  onNewTask?: (taskName: string) => void,
  onTaskEnded?: () => void,
};

type deviceState = {
  hasConnection: boolean,
  freeStorage: number,
  totalRAM: number,
  usedRAM: number,
  freeRAM: number,
}

// AI Service:
class AiService{
    private context: LlamaContext | null = null;

    /** 
     * Alerts the user that they're below the free RAM requirements 
     * and confirms if they want to continue.
    */
    private async userMinRamConfirmation(): Promise<boolean> { 
      const deviceState = await this.getDeviceState();

      const minFreeRamGigs = appSettings.device.minDeviceFreeBytesRAM / Math.pow(10, 9);
      const freeRamGigs = Math.floor(deviceState.freeRAM / Math.pow(10, 9) * 100) / 100;

      console.log(freeRamGigs);

      return new Promise<boolean>((resolve) => {
        Alert.alert(
          "Confirmation:",
          `You don't have the recommended amount of free RAM (${minFreeRamGigs}GB).\n\n(You have ${freeRamGigs}GB.)\n\nDo you wish to continue?`,
          [
            { text: "YES", onPress: () => resolve(true) },
            { text: "NO", onPress: () => {
                BackHandler.exitApp();
                resolve(false);
              }
            },
          ],
          { cancelable: false }
        );
    });
  }

    /** 
     * Returns the phones connection status, free storage, total RAM, used RAM, and free RAM.
    */
    async getDeviceState(): Promise<deviceState> {
      const check: deviceState = {
        hasConnection: false,
        freeStorage: 0,
        totalRAM: 0,
        usedRAM: 0,
        freeRAM: 0,
      };

      // Connection Check:
      const netInfo = await NetInfo.fetch();
      check.hasConnection = netInfo.isConnected ?? false;

      // Storage Check:
      check.freeStorage = await DeviceInfo.getFreeDiskStorage();

      // Ram Check:
      check.totalRAM = await DeviceInfo.getTotalMemory();
      check.usedRAM = await DeviceInfo.getUsedMemory();
      check.freeRAM = check.totalRAM - check.usedRAM;

      return check;
    }

    /** 
     * Fires the 'onTaskEnded' progress function, if it exists.
    */
    private onTaskEnded = (progFuncs?: aiInitProgressFuncs) => {
      if (progFuncs?.onTaskEnded !== undefined){
        progFuncs.onTaskEnded();
      }
    }

    /** 
     * Fires the 'onNewTask' progress function, if it exists.
    */
    private onNewTask = (progFuncs?: aiInitProgressFuncs, taskName?: string) => {
      if (progFuncs?.onNewTask !== undefined){
        progFuncs.onNewTask(taskName || "");
      }
    }

    private async downloadModel(progFuncs?: aiInitProgressFuncs){
      // Vars:
      const downloadedAiModel = await AiFileCheck.fullyDownloadedAiModel();
      const downloadedMMProj = await AiFileCheck.fullyDownloadedMMProj();
      const downloadedAllFiles = !downloadedAiModel || !downloadedMMProj;

      let deviceState: deviceState = await this.getDeviceState();
      const updateDeviceState = async () => { deviceState = await this.getDeviceState(); };

      // Connection Check:
      if (!downloadedAllFiles && !deviceState.hasConnection){
        throw new Error(`No Connection detected. We need to download the AI model, then you can go offline.`);
      }

      // AI model:
      this.onNewTask(progFuncs, "Downloading AI Model");

      if (!downloadedAiModel){

        // Check if can download:
        const aiResponse = await fetch(aiModelDownloadLink, { method: 'HEAD' });
        const aiContentLengthStr = aiResponse.headers.get("content-length");

        if (!aiContentLengthStr){
          throw new Error(`Failed to get AI Models File Size. HTTP Error: '${aiResponse.statusText}'`);
        }
        const aiContentLength = parseInt(aiContentLengthStr);

        if (deviceState.freeStorage < aiContentLength){
          const neededSpace = (aiContentLength - deviceState.freeStorage) / Math.pow(10, 9);
          const prettyNeededSpace = Math.floor(neededSpace * 1000) / 1000;

          throw new Error(`AI Model is too big to download. An Extra ${prettyNeededSpace} GB is needed.`);
        }

        // Download:
        const { promise } = RNFS.downloadFile({
          fromUrl: aiModelDownloadLink,
          toFile: aiModelDest,
          progress: progFuncs?.downloadModel,
        });

        await promise;
        await AiFileCheck.setDownloadedAiModel(true);
        await updateDeviceState();
      }
      
      this.onTaskEnded(progFuncs);

      // Multimodal Projector:
      this.onNewTask(progFuncs, "Downloading AI Model's\nMulitimodal Projector");

      if (!downloadedMMProj){

        // Check if can download:
        const mmprojResponse = await fetch(aiMMProjDownloadLink, { method: 'HEAD' });
        const mmprojContentLengthStr = mmprojResponse.headers.get("content-length");

        if (!mmprojContentLengthStr){
          throw new Error(`Failed to get AI Model's Multimodal Projector File Size. HTTP Error: '${mmprojResponse.statusText}'`);
        }
        const mmprojContentLength = parseInt(mmprojContentLengthStr);

        if (deviceState.freeStorage < mmprojContentLength){
          const neededSpace = (mmprojContentLength - deviceState.freeStorage) / Math.pow(10, 9);
          const prettyNeededSpace = Math.floor(neededSpace * 1000) / 1000;

          throw new Error(`AI Model's Multimodal Projector is too big to download. An Extra ${prettyNeededSpace}GB is needed.`);
        }

        // Download:
        const { promise } = RNFS.downloadFile({
          fromUrl: aiMMProjDownloadLink,
          toFile: aiMMProjDest,
          progress: progFuncs?.downloadMMProj,
        });

        await promise;
        await AiFileCheck.setDownloadedMMProj(true);
        await updateDeviceState();
      }

      this.onTaskEnded(progFuncs);
    }

    async init(progFuncs?: aiInitProgressFuncs) {
      await this.downloadModel(progFuncs);

      if (this.context) return;

      // RAM Check:
      const deviceState = await this.getDeviceState();

      const freeRamGigs = Math.floor(deviceState.freeRAM / Math.pow(10, 9) * 100) / 100;

      console.log(freeRamGigs);

      if (deviceState.freeRAM < appSettings.device.minDeviceFreeBytesRAM){
        if (!(await this.userMinRamConfirmation())){
          return;
        }
      }

      // AI:
      this.onNewTask(progFuncs, "Initializating AI Model");

      this.context = await initLlama({
        model: aiModelDest,
        use_mlock: true,
        n_ctx: 4096,
        n_gpu_layers: 99,
        ctx_shift: false,
      }, progFuncs?.initModel );

      this.onTaskEnded(progFuncs);

      // MMProj:
      this.onNewTask(progFuncs, "Initializating AI Model's\nMultimodal Projector");

      const success = await this.context.initMultimodal({
        path: aiMMProjDest,
        use_gpu: true,
      });

      if (!success){
        throw new Error("Failed to initialize the AI model's Multimodal Projector.")
      }

      this.onTaskEnded(progFuncs);
    }

    /** 
     * Same as 'userCompletion' but is instructed to be a chatbot.
     * 
     * (CAN'T READ IMAGES.)
    */
    async textCompletion(params: CompletionParams): Promise<NativeCompletionResult> {
      params.stop = appSettings.ai.stopWords;
      params.n_predict = appSettings.ai.text_n_perdict;

      const settingsStore = useSettingsStore.getState();
      if (!settingsStore.settings.systemCompletion) return this.userCompletion(params);

      params.messages = params.messages?.concat(appSettings.ai.universalCompletionMessage);
      params.messages = params.messages?.concat(appSettings.ai.textCompletionMessage);
      return this.userCompletion(params);
    }

    /** 
     * Same as 'userCompletion' but is instructed to be a imagebot.
     * 
     * (CAN READ IMAGES AND READ TEXT.)
    */
    async imageCompletion(params: CompletionParams): Promise<NativeCompletionResult> {
      params.stop = appSettings.ai.stopWords;
      params.n_predict = appSettings.ai.imagery_n_predict;

      const settingsStore = useSettingsStore.getState();
      if (!settingsStore.settings.systemCompletion) return this.userCompletion(params);

      params.messages = params.messages?.concat(appSettings.ai.universalCompletionMessage);
      params.messages = params.messages?.concat(appSettings.ai.imageCompletionMessage);
      return this.userCompletion(params);
    }

    /** 
     * Same as 'rawCompletion' but the users settings can change the params.
    */
    async userCompletion(params: CompletionParams): Promise<NativeCompletionResult>{
      const settingsStore = useSettingsStore.getState();

      if (settingsStore.settings.prepromptedMessage){
        params.messages = params.messages?.concat([
          {
            role: "administrator",
            content: settingsStore.settings.prepromptedMessage,
          },
        ]);
      }

      return this.rawCompletion(params);
    }

    /** 
     * Sends the given messages to the AI with no pre-input instructions.
    */
    async rawCompletion(params: CompletionParams): Promise<NativeCompletionResult> {
      try {

        if (!this.context){
          throw new Error("AI context is undefined.");
        }

        return await this.context.completion(params);

      } catch(errorMsg) {

        throw new Error(`Error while trying to generate a response:, ${errorMsg}`);

      }
    }

    /** 
     * Converts a image to base64, making it easier to give AI images.
    */
    async imageToBase64(requiredFile: string, removePrefix?: boolean): Promise<string> {
      const asset = Asset.fromModule(requiredFile); 
      await asset.downloadAsync();

      const file = new File(asset.localUri!);
      const base64 = await file.base64();
      const ext = file.extension.slice(1);

      return !removePrefix && `data:image/${ext};base64,${base64}` || base64;
    }

    /** 
     * Gives a Base64 image with a prefix, so that react native and other libraries can read it.
     * 
     * for example:
     * 
     * Turns {**BASE64**} to {data:image/jpg;base64,**BASE64**}
    */
    async addImageBase64Prefix(base64: string){
      return `data:image/jpg;base64,${base64}`;
    }

    /** 
     * Removes the Base64 prefix. (**addImageBase64Prefix** is the inverse of this.)
    */
    async removeImageBase64Prefix(base64: string){
      return base64.split(",")[1];
    }

    /** 
     * Gets the AI's model name and MMProj name. (That's it.)
    */
    public getAiModelInfo(){
      const info = {
        aiModelName: "",
        mmprojModelMame: "",
      };
      
      const aiModelFullName = aiModelDownloadLink.split("/").pop();
      info.aiModelName = aiModelFullName?.substring(0, aiModelFullName.lastIndexOf(".")) || "UNKNOWN AI MODEL";

      const mmprojFullName =  aiMMProjDownloadLink.split("/").pop();
      info.mmprojModelMame = mmprojFullName?.substring(0, mmprojFullName.lastIndexOf(".")) || "UNKNOWN MMPROJ MODEL";

      return info;
    }

    async cleanUp(){
      try{ await this.context?.releaseMultimodal(); } catch{}
      try{ await this.context?.release(); } catch{}
    }
};

export default new AiService
