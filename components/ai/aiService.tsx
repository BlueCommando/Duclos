import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { CompletionParams, initLlama, LlamaContext, NativeCompletionResult } from 'llama.rn';
import RNFS, { DownloadProgressCallbackResult } from 'react-native-fs';

// Help with llama.rn:
// https://github.com/mybigday/llama.rn/blob/main/README.md
//
// Help with getting AI multimodal projectors:
// https://github.com/ggml-org/llama.cpp/tree/master/tools/mtmd#how-to-obtain-mmproj
//
// Used Model Link:
// https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF

// TODO:
// debug print func to clear the annoying prints. ✅
// try to get the multimodal projector to work. ✅
// try to make this get init in the index and report progress back to index. ❌

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

const debugMode = true;
const debugPrint = (...msg: any[]) => {
  if (!debugMode) return;
  console.log(msg)
};

type aiInitProgressFuncs = {
  downloadModel?: (res: DownloadProgressCallbackResult) => void,
  downloadMMProj?: (res: DownloadProgressCallbackResult) => void,
  initModel?: (percentage: number) => void,
  onMMProjInited?: () => void,
};

class aiService{
    private context: LlamaContext | null = null;

    private async downloadModel(progFuncs?: aiInitProgressFuncs){
      // AI model:
      if (!(await RNFS.exists(aiModelDest))){
        const { promise } = RNFS.downloadFile({
          fromUrl: aiModelDownloadLink,
          toFile: aiModelDest,
          progress: progFuncs?.downloadModel
        });
        await promise;
      }

      // Multimodal Projector:
      if (!(await RNFS.exists(aiMMProjDest))){
        const { promise } = RNFS.downloadFile({
          fromUrl: aiMMProjDownloadLink,
          toFile: aiMMProjDest,
          progress: progFuncs?.downloadMMProj
        });
        await promise;
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
        throw new Error("Failed to initialize the AI model's multimodel projector.")
      }
      debugPrint("initing done!");
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
        console.log("Response Took: (", Math.floor(diffTime / 3600), ":", Math.floor(diffTime % 3600) / 60, ":", diffTime % 60, ")");

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
      const fullBase64 = `data:image/${ext};base64,${base64}`;

      // rewrite this to make it look pretty
      return new Promise((resolve, reject) => {
        resolve(fullBase64)
      });
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
