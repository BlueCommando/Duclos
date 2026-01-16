import { createChatStyle } from "@/assets/styles/chat.style";
import useTheme from "@/hooks/useTheme";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const colors = useTheme()
  const chatStyle = createChatStyle(colors)

  return (
    <LinearGradient 
      colors={colors.gradients.background}
      style={chatStyle.container}
    >
      <SafeAreaView>
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Text>I'm just like wally west!</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}
