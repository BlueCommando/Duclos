import { createChatStyle } from "@/assets/styles/chat.style";
import aiService from '@/components/ai/aiService';
import InputText from "@/components/chat/inputText";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// finish loading screen


const test = async (msg: string) => {
  await aiService.init({
    downloadModel: res => {
      console.log("AI Model Download:", res.bytesWritten / res.contentLength)
    },
    downloadMMProj: res => {
      console.log("MMProj Download:", res.bytesWritten / res.contentLength)
    },
    initModel: alpha => {
      console.log("initing AI Model:", alpha)
    },
  });

  const response = await aiService.imageCompletion({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: await aiService.imageToBase64(require("../assets/images/q2.png")),
            },
          }
        ],
      },
      {
        role: "system",
        content: "Your job is to solve the problem from the given image."
      },
    ]
  })

  console.log("Response complete!")
  return response.text
  //*/
}

export default function Index() {
  const colors = useTheme()
  const chatStyle = createChatStyle(colors)

  const handleMsg = async (msg: string) => {
    if (msg.trim() === ""){
      return
    }

    console.log(`${msg}\n\n`)
    console.log(await test(msg))
  }

  return (
    <LinearGradient 
      colors={colors.gradients.background}
      style={chatStyle.container}
    >
      <SafeAreaView>
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Text>I'm just like wally west!</Text>
        <InputText onSend={handleMsg} />
        <Image
          source={require("../assets/images/q2.png")}
          style={{ width: 350, height: 150 }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
