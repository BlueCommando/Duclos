import { createChatModeStyle } from '@/assets/styles/chat/chatMode.style';
import { Chat } from '@/components/app/Chat';
import useTheme from '@/hooks/useTheme';
import { View } from "react-native";

export default function Index() {
  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  return (
    <View style={stylesheet.container}>
      <Chat/>
    </View>
  );
}
