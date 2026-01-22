import { CompletionParams, initLlama, LlamaContext, NativeCompletionResult } from 'llama.rn';
import RNFS from 'react-native-fs';

// Help with AI multimodal projectors:
// https://github.com/ggml-org/llama.cpp/tree/master/tools/mtmd#how-to-obtain-mmproj
//
// Used Model Link:
// https://huggingface.co/ZiangWu/MobileVLM_V2-1.7B-GGUF

// TODO:
// try to get the multimodal projector to work.
// debug print func to clear the annoying prints.
// try to make this get init in the index and report progress back to index.

const aiModelName = "ggml-model-q4_k.gguf"
const aiMMProjName = "mmproj-model-f16.gguf"

const aiModelDest = `${RNFS.DocumentDirectoryPath}/${aiModelName}`;
const aiMMProjDest = `${RNFS.DocumentDirectoryPath}/${aiMMProjName}`;

const aiModelDownloadLink = "https://huggingface.co/ZiangWu/MobileVLM_V2-1.7B-GGUF/resolve/main/ggml-model-q4_k.gguf"
const aiMMProjDownloadLink = "https://huggingface.co/ZiangWu/MobileVLM_V2-1.7B-GGUF/resolve/main/mmproj-model-f16.gguf"

class aiService{
    private context: LlamaContext | null = null;

    private async downloadModel(){
      if (await RNFS.exists(aiModelDest)) return;

      console.log("downloading ai model...")

      const { promise } = RNFS.downloadFile({
        fromUrl: aiModelDownloadLink,
        toFile: aiModelDest,
        progress: response => {
          const alpha = response.bytesWritten / response.contentLength;
          console.log("Downloading AI Model:", Math.floor(alpha * 100))
        },
        begin: response => {
          console.log(response.statusCode)
        }
      })
      await promise
      console.log("downloaded ai model!")
    }

    async init() {
      await this.downloadModel()
      console.log("inited ai files!")
      console.log("loading ai files...")

      if (this.context){
        return
      }

      this.context = await initLlama({
        model: aiModelDest,
        use_mlock: true, // force system to keep model in RAM
        n_ctx: 2048, // max number of tokens
        n_gpu_layers: 1, // > 0: enable Metal on iOS,
        ctx_shift: true,
      }, alpha => {
        console.log("Init AI Model Progess:", alpha)
      });

      console.log("ai files loaded completed!")

      /*
      console.log("initing multimodal")

      const success = await aiContext.initMultimodal({
        path: aiMMProjDest,
        use_gpu: true,
      });

      if (success){
        console.log('Multimodal support initialized!')

        // Check what modalities are supported
        const support = await aiContext.getMultimodalSupport()
        console.log('Vision support:', support.vision)
        console.log('Audio support:', support.audio)
      } else {
        console.log('Failed to initialize multimodal support')
      }

      await aiContext.releaseMultimodal();
      */
    }

    async completion(params: CompletionParams): Promise<NativeCompletionResult> {
      try {

        if (!this.context){
          throw new Error("AI context is undefined.");
        }
        return await this.context.completion(params);

      } catch(errorMsg) {

        throw new Error(`Error while trying to generate a response:, ${errorMsg}`);

      }
    }

    async cleanUp(){
      try{ await this.context?.release() } catch{}
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

console.log('AI Response:', result.text)
*/

export default new aiService
