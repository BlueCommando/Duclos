//import "../polyfills"
import { createChatStyle } from "@/assets/styles/chat.style";
import aiService from '@/components/ai/aiService';
import InputText from "@/components/chat/inputText";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//FS.copyFile("./DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_L", FS.DocumentDirectoryPath)

const test = async (msg: string) => {
  console.log("loading model...");
  await aiService.init();
  const response = await aiService.completion({
    messages: [
      {
        role: "user",
        content: msg,
      }
    ]
  })
  
  /*
  await llamaService.initialize()

  const response = await llamaService.completion([
    {
      role: "user",
      content: msg
    },
  ])

  llamaService.cleanup()

  return response
  */
  //*
  console.log("Response complete!")
  return response.text
  //*/
}

// try 'https://github.com/mybigday/llama.rn' instead...


export default function Index() {
  /*
  const [ip, setIp] = useState("0.0.0.0");

  useEffect(() => {
    if (Platform.OS == "android"){
      setIp("10.0.2.2") // not working!
    } else {
      getIpAddressAsync().then(setIp);
    }
  }, []); // empty array = run once

  console.log("Users IP:", ip);
  */


  const colors = useTheme()
  const chatStyle = createChatStyle(colors)

  const handleMsg = async (msg: string) => {
    if (msg.trim() === ""){
      return
    }

    console.log(msg)
    console.log(await test(msg))

    /*
    const aiServerAddress = `http://${ip}:${settings.port}`

    const responseProm = fetch(aiServerAddress, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: msg
      }),
    })
    responseProm.then((response) => {
      response.json().then(result => {
        console.log(result)
      }).catch(errorMsg => {
        console.error(`(Address: ${aiServerAddress}) Error while trying to read response:`, errorMsg)
      })
    }).catch(errorMsg => {
      console.error(`(Address: ${aiServerAddress}) Error while sending to server:`, errorMsg)
    })
      */
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
      </SafeAreaView>
    </LinearGradient>
  );
}
