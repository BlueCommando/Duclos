import appSettings from '@/assets/appSettings';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { CompletionParams, initLlama, LlamaContext, NativeCompletionResult } from 'llama.rn';
import { BackHandler } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS, { DownloadProgressCallbackResult } from 'react-native-fs';
import NetInfo from "@react-native-community/netinfo";

// Things to do:
//
// Check Wifi ✅
// Delete Files if the app is closed ✅
// Save data that the user actually fully downloaded the model ❌
// Change AI to settings file (userDataService?) ❌
// Kick user if errors ❌
// Loading bar (4 phases, downloading model and mmproj and initing them) (and wait 3 secs after) ❌
// Update loading screen to support dark-mode and light-mode (including status bar) ❌

// Help with llama.rn:
// https://github.com/mybigday/llama.rn/blob/main/README.md
//
// Help with getting AI multimodal projectors:
// https://github.com/ggml-org/llama.cpp/tree/master/tools/mtmd#how-to-obtain-mmproj
//
// Used Model Link:
// https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF

/*Shutdown app with alert:

Alert.alert("WARNING:", "Your Device does not meet the standard requirements of something", [
  { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
  { text: "OK", onPress: () => BackHandler.exitApp() }
])
*/

// Downloads:

// Download async-storage to save that the model is fully downloaded:
// npm i @react-native-async-storage/async-storage

// use this for wifi check:
// npm i @react-native-community/netinfo

const aiModelName = "aiModel.gguf";
const aiModelDest = `${RNFS.DocumentDirectoryPath}/${aiModelName}`;
const aiModelDownloadLink = "https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/resolve/main/Qwen2.5-VL-7B-Instruct-UD-Q2_K_XL.gguf";

const aiMMProjName = "mmproj.gguf";
const aiMMProjDest = `${RNFS.DocumentDirectoryPath}/${aiMMProjName}`;
const aiMMProjDownloadLink = "https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/resolve/main/mmproj-F16.gguf";

const stopWords = ['</s>', '<|im_end|>'];

const textCompletionMessage = [
  {
    role: "system",
    content: "You are an AI assistant. Do not interpret or reference images. Respond using text only.",
  },
];

const imageCompletionMessage = [
  {
    role: "system",
    content: "You are an AI assistant with vision capabilities. You can analyze and describe images when provided.",
  },
];

type aiInitProgressFuncs = {
  downloadModel?: (res: DownloadProgressCallbackResult) => void,
  downloadMMProj?: (res: DownloadProgressCallbackResult) => void,
  initModel?: (percentage: number) => void,
};

type deviceState = {
  hasWifi: boolean,
  freeStorage: number,
  totalRAM: number,
  usedRAM: number,
  freeRAM: number,
}

class aiService{
    private context: LlamaContext | null = null;

    /** 
     * Returns the phones wifi status, free storage, total RAM, used RAM, and free RAM.
    */
    async getDeviceState(): Promise<deviceState> {
      const check: deviceState = {
        hasWifi: false,
        freeStorage: 0,
        totalRAM: 0,
        usedRAM: 0,
        freeRAM: 0,
      };

      // Wifi Check:
      const netInfo = await NetInfo.fetch();
      check.hasWifi = netInfo.isConnected ?? false;

      // Storage Check:
      check.freeStorage = await DeviceInfo.getFreeDiskStorage();

      // Ram Check:
      check.totalRAM = await DeviceInfo.getTotalMemory();
      check.usedRAM = await DeviceInfo.getUsedMemory();
      check.freeRAM = check.totalRAM - check.usedRAM;

      return check;
    }

    private async downloadModel(progFuncs?: aiInitProgressFuncs){
      let deviceState: deviceState = await this.getDeviceState();
      const updateDeviceState = async () => { deviceState = await this.getDeviceState(); };

      // Wifi Check:
      if (!deviceState.hasWifi){
        throw new Error(`No Wifi detected. We need to download the AI model, then you can go offline.`);
      }

      // AI model:
      // Check if can download
      const aiResponse = await fetch(aiModelDownloadLink, { method: 'HEAD' });
      const aiContentLengthStr = aiResponse.headers.get("content-length");

      if (!aiContentLengthStr){
        throw new Error(`Failed to get AI Models File Size. HTTP Error: '${aiResponse.statusText}'`)
      }
      const aiContentLength = parseInt(aiContentLengthStr);

      if (deviceState.freeStorage < aiContentLength){
        const neededSpace = (aiContentLength - deviceState.freeStorage) / Math.pow(10, 9);
        const prettyNeededSpace = Math.floor(neededSpace * 1000) / 1000;
        throw new Error(`AI Model is too big to download. An Extra ${prettyNeededSpace} GB is needed.`);
      }

      // Delete old file if download is uncomplete.
      if (await RNFS.exists(aiModelDest)){
        const fileInfo = await RNFS.stat(aiModelDest)

        if (fileInfo.size !== aiContentLength){
          await RNFS.unlink(aiModelDest)
        }
      }

      // Download
      // check user data instead of file existence
      if (!(await RNFS.exists(aiModelDest))){
        const { promise } = RNFS.downloadFile({
          fromUrl: aiModelDownloadLink,
          toFile: aiModelDest,
          progress: progFuncs?.downloadModel,
        });

        await promise;

        // Tell data it's fully downloaded


        await updateDeviceState();
      }

      // Multimodal Projector:
      // Check if can download
      const mmprojResponse = await fetch(aiMMProjDownloadLink, { method: 'HEAD' });
      const mmprojContentLengthStr = mmprojResponse.headers.get("content-length");

      if (!mmprojContentLengthStr){
        throw new Error(`Failed to get AI Model's Multimodal Projector File Size. HTTP Error: '${mmprojResponse.statusText}'`);
      }
      const mmprojContentLength = parseInt(mmprojContentLengthStr);

      if (deviceState.freeStorage < mmprojContentLength){
        const neededSpace = (mmprojContentLength - deviceState.freeStorage) / Math.pow(10, 9);
        const prettyNeededSpace = Math.floor(neededSpace * 1000) / 1000;
        throw new Error(`AI Model's Multimodal Projector is too big to download. An Extra ${prettyNeededSpace} GB is needed.`);
      }

      // Delete old file if download is uncomplete.
      if (await RNFS.exists(aiMMProjDest)){
        const fileInfo = await RNFS.stat(aiMMProjDest);

        if (fileInfo.size !== mmprojContentLength){
          await RNFS.unlink(aiMMProjDest);
        }
      }

      // Download
      // check user data instead of file existence
      if (!(await RNFS.exists(aiMMProjDest))){
        const { promise } = RNFS.downloadFile({
          fromUrl: aiMMProjDownloadLink,
          toFile: aiMMProjDest,
          progress: progFuncs?.downloadMMProj,
        });

        await promise;

        // Tell data it's fully downloaded
        

        await updateDeviceState();
      }
    }

    async init(progFuncs?: aiInitProgressFuncs) {
      await this.downloadModel(progFuncs);

      if (this.context) return;

      this.context = await initLlama({
        model: aiModelDest,
        use_mlock: true,
        n_ctx: 4096, // max number of tokens
        n_gpu_layers: 20, // > 0: enable Metal on iOS,
        ctx_shift: true,
      }, progFuncs?.initModel );

      const success = await this.context.initMultimodal({
        path: aiMMProjDest,
        use_gpu: true,
      });

      if (!success){
        throw new Error("Failed to initialize the AI model's Multimodal Projector.")
      }
    }

    /** 
     * Same as 'rawCompletion' but is instructed to be a chatbot.
     * (CAN'T READ IMAGES.)
    */
    async textCompletion(params: CompletionParams): Promise<NativeCompletionResult> {
      params.stop = stopWords;
      //params.n_predict = 100;
      params.messages?.concat(textCompletionMessage);
      return this.rawCompletion(params)
    }

    /** 
     * Same as 'rawCompletion' but is instructed to be a imagebot.
     * (CAN READ IMAGES AND READ TEXT.)
    */
    async imageCompletion(params: CompletionParams): Promise<NativeCompletionResult> {
      params.stop = stopWords;
      //params.n_predict = 100;
      params.messages?.concat(imageCompletionMessage);
      return this.rawCompletion(params)
    }

    /** 
     * Sends the given messages to the AI with no pre-input instructions.
    */
    async rawCompletion(params: CompletionParams): Promise<NativeCompletionResult> {
      try {

        if (!this.context){
          throw new Error("AI context is undefined.");
        }

        console.log("generating message...");
        const startTime = Math.floor(Date.now() / 1000);
        const response = await this.context.completion(params);
        const diffTime = Math.floor(Date.now() / 1000) - startTime;
        console.log("Response Took: (", Math.floor(diffTime / 3600), ":", Math.floor((diffTime % 3600) / 60), ":", diffTime % 60, ")");

        return response;

      } catch(errorMsg) {

        throw new Error(`Error while trying to generate a response:, ${errorMsg}`);

      }
    }

    /** 
     * Converts a image to base64, making it easier to give AI images.
    */
    async imageToBase64(requiredFile: string): Promise<string> {
      const asset = Asset.fromModule(requiredFile); 
      await asset.downloadAsync();

      const file = new File(asset.localUri!);
      const base64 = await file.base64();
      const ext = file.extension.slice(1);

      return `data:image/${ext};base64,${base64}`;
    }

    async cleanUp(){
      try{ await this.context?.releaseMultimodal(); } catch{}
      try{ await this.context?.release(); } catch{}
    }
};

// Message example:

/*
const result = await context.completion({
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What do you see in this image?',
        },
        {
          type: 'image_url',
          image_url: {
            url: 'file:///path/to/image.jpg',
            // or base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...'
          },
        },
      ],
    },
  ],
  n_predict: 100,
  temperature: 0.1,
})

debugPrint('AI Response:', result.text)
*/

export default new aiService
