import { createChatStyle } from "@/assets/styles/chat.style";
import InputText from "@/components/chat/inputText";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colors = useTheme()
  const chatStyle = createChatStyle(colors)

  const handleMsg = (msg: string) => {
    console.log(msg)
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
