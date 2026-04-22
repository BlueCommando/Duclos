import { createChatModeStyle } from '@/assets/styles/chat/chatMode.style';
import { Chat, ChatRef } from '@/components/app/Chat';
import genUniqueStr from '@/components/other/GenerateUniqueString';
import hexToRgba from '@/components/other/HexToRGBA';
import { chatLogs, getUsersChatLogs, log, saveUsersChatLogs } from '@/components/userData/UserChatLogs';
import useTheme from '@/hooks/useTheme';
import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View, Image, Dimensions, Text, Alert } from "react-native";
import ContextMenu, { ContextMenuAction } from 'react-native-context-menu-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';

export default function Index() {
  const chatRef = useRef<ChatRef>(null);

  const [showingChats, changeShowingChats] = useState(false);
  const [chatLogs, setChatLogs] = useState<chatLogs | null>(null);
  const [currentChatId, changeCurrentChatId] = useState<number | null>(null);

  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  // Funcs
  const onPressShowChats = () => {
    changeShowingChats(prev => !prev);
  }

  const switchChat = (chatId: number) => {
    if (!chatLogs) return;
    changeShowingChats(false);
    changeCurrentChatId(chatId);
    console.log(chatLogs)
    chatRef.current?.setAllMessages((chatLogs)[chatId].logs);
  }

  const createNewChat = () => {
    let newChatId = -1;

    setChatLogs(prev => {
      const newChatLogs = [...(prev || [])];

      newChatId = newChatLogs.push({
        name: `Chat: #${newChatLogs.length + 1}`,
        logs: [],
      });

      saveUsersChatLogs(newChatLogs);

      return newChatLogs;
    });

    console.log(newChatId)
    switchChat(newChatId);
  }

  const deleteChat = (chatId: number) => {
    Alert.alert(
      "Confirmation:", 
      "Deleting a chat is irreversible. Are you sure?",
      [
        {
          text: "YES", 
          onPress: () => {
            setChatLogs(prev => {
              prev = prev || [];
              const logs = prev[chatId].logs;

              for (var i = 0; i < logs.length; i++) {
                const v = logs[i];
                if (v.type !== "image") continue;
                RNFS.unlink(v.content);
              }

              const newChatLogs = prev.filter((_, i) => chatId !== i);
              saveUsersChatLogs(newChatLogs);
              return newChatLogs;
            });
        }},

        {text: "NO"},
      ]
    )
  }

  // Get all of the Users Chats
  useEffect(() => {
    const a = async () => setChatLogs(await getUsersChatLogs());
    a();
  }, [])

  // User Chat Options
  const chatOptions = [
    {
      title: "Rename Chat",
      onPress: (chatId: number) => {

      },
    },
    {
      title: "Delete Chat",
      onPress: (chatId: number) => {
        deleteChat(chatId);
      },
    },
  ]

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
          {showingChats ? 
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
                    chatId={i}
                    onPress={() => {
                      switchChat(i);
                      changeShowingChats(false);
                    }}
                    chatOptions={chatOptions}
                    key={genUniqueStr(8)}
                  />
                })
              }

            </SafeAreaView> : null
          }
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
  chatId: number,
  chatOptions: (ContextMenuAction & { onPress?: (chatId: number) => void })[],
  onPress?: () => void,
}

const ChatOption = ({name, chatId, chatOptions, onPress}: ChatOptionProps) => {
  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  return (
    <View style={stylesheet.chatOption}>
      <TouchableOpacity style={stylesheet.chatOption} onPress={onPress}>
        <TouchableOpacity style={stylesheet.createChatButton} >
          <ContextMenu 
            style={stylesheet.createChatButton} 
            actions={chatOptions}
            dropdownMenuMode={true}
            onPress={(e) => {
              if (!chatOptions) return;
              const onContextPress = chatOptions[e.nativeEvent.index].onPress;
              if (!onContextPress) return;
              onContextPress(chatId);
            }}
          > 
            <Image style={stylesheet.fitImage} source={require("@/assets/app/PLACEHOLDER.png")}/>
          </ContextMenu>
        </TouchableOpacity>

        <Text style={stylesheet.chatOptionText} numberOfLines={1}>{name}</Text>
      </TouchableOpacity>
    </View>
  )
}
