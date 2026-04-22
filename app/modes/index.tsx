import { createChatModeStyle } from '@/assets/styles/chat/chatMode.style';
import { Chat, ChatRef } from '@/components/app/Chat';
import genUniqueStr from '@/components/other/GenerateUniqueString';
import hexToRgba from '@/components/other/HexToRGBA';
import { chatLogs, getUsersChatLogs, log, saveUsersChatLogs } from '@/components/userData/UserChatLogs';
import useTheme from '@/hooks/useTheme';
import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View, Image, Dimensions, Text } from "react-native";
import ContextMenu, { ContextMenuAction } from 'react-native-context-menu-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const chatRef = useRef<ChatRef>(null);

  const [showingChats, changeShowingChats] = useState(false);
  const [chatLogs, setChatLogs] = useState<chatLogs | null>(null);

  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  // Funcs
  const onPressShowChats = () => {
    changeShowingChats(prev => !prev);
  }

  const switchChat = (chatId: number) => {
    
  }

  const createNewChat = () => {
    setChatLogs(prev => {
      const newChatLogs = [...(prev || [])];

      newChatLogs.push({
        name: `Chat: #${newChatLogs.length + 1}`,
        logs: [],
      });

      console.log(newChatLogs)

      saveUsersChatLogs(newChatLogs);

      return newChatLogs;
    })
  }

  const deleteChat = () => {

  }

  // Get all of the Users Chats
  useEffect(() => {
    const a = async () => setChatLogs(await getUsersChatLogs());
    a();
  }, [])

  // Animating Chats
  const screenWidth = Dimensions.get("window").width;
  const goalWidth = screenWidth * 0.6;
  const widthAnim = useRef(new Animated.Value(0)).current;

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: showingChats ? [0, goalWidth] : [goalWidth, 0],
  });

  useEffect(() => {
    widthAnim.setValue(0);

    Animated.timing(widthAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [showingChats]);

  // Background Transparency
  const chooseChatContainer = showingChats && { 
    backgroundColor: hexToRgba(theme.lowerBackground, 0.5),
  } || {}

  return (
    <View style={stylesheet.container}>
      <SafeAreaView style={stylesheet.container} edges={["top"]}>
        <Chat ref={chatRef}/>
      </SafeAreaView>

      <View style={[stylesheet.chooseChatContainer, chooseChatContainer]}>
        <Animated.View style={[stylesheet.allChatsView, {width: width}]}>
          ({showingChats && 
            <SafeAreaView style={[stylesheet.container, {gap: 10}]} edges={["top"]}>
              <TouchableOpacity style={stylesheet.chatOption} onPress={createNewChat}>
                <View style={stylesheet.createChatButton}> 
                  <Image style={stylesheet.fitImage} source={require("@/assets/app/PLACEHOLDER.png")}/>
                </View>

                <Text style={stylesheet.chatOptionText}  numberOfLines={1}>Create New Chat</Text>
              </TouchableOpacity>

              <View style={{height: 5}}/>

              {
                chatLogs?.map((v, i) => {
                  return <ChatOption
                    name={v.name}
                    onPress={() => {
                      switchChat(i);
                      console.log(showingChats)
                      changeShowingChats(false);
                    }}
                    key={genUniqueStr(8)}
                  />
                })
              }

            </SafeAreaView>
          })
        </Animated.View>

        <SafeAreaView style={stylesheet.showAllChatsContainer} pointerEvents="box-none">
          <View style={stylesheet.container}>
            <TouchableOpacity style={stylesheet.showAllChatsButton} onPress={onPressShowChats}>
              <Image style={stylesheet.fitImage} source={require("@/assets/app/PLACEHOLDER.png")}/>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

type ChatOptionProps = {
  name: string,
  attachOptions?: (ContextMenuAction & { onPress?: () => void })[],
  onPress?: () => void,
}

const ChatOption = ({name, attachOptions, onPress}: ChatOptionProps) => {
  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  return (
    <View style={stylesheet.chatOption}>
      <TouchableOpacity style={stylesheet.chatOption} onPress={onPress}>
        <ContextMenu 
          style={stylesheet.createChatButton} 
          actions={attachOptions}
          dropdownMenuMode={true}
          onPress={(e) => {
            if (!attachOptions) return;
            const onContextPress = attachOptions[e.nativeEvent.index].onPress;
            if (!onContextPress) return;
            onContextPress();
          }}
        > 
          <Image style={stylesheet.fitImage} source={require("@/assets/app/PLACEHOLDER.png")}/>
        </ContextMenu>

        <Text style={stylesheet.chatOptionText}  numberOfLines={1}>{name}</Text>
      </TouchableOpacity>
    </View>
  )
}
