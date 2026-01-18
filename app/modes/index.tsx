import { createChatStyle } from "@/assets/styles/chat.style";
import InputText from "@/components/chat/inputText";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import settings from "@/ai/settings.json";
import { getIpAddressAsync } from "expo-network";
import { useEffect, useState } from "react";

export default function Index() {
  const [ip, setIp] = useState("0.0.0.0");

  useEffect(() => {
    if (Platform.OS == "android"){
      setIp("10.0.2.2") // not working!
    } else {
      getIpAddressAsync().then(setIp);
    }
  }, []); // empty array = run once

  console.log("Users IP:", ip);


  const colors = useTheme()
  const chatStyle = createChatStyle(colors)

  const handleMsg = (msg: string) => {
    if (msg.trim() === ""){
      return
    }

    console.log(msg)
    // see if message has unnatural characters from auto correct

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
