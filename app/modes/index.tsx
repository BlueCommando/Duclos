import { createChatModeStyle } from '@/assets/styles/chat/chatMode.style';
import { Chat, ChatRef, messageFormat } from '@/components/app/Chat';
import genUniqueStr from '@/components/other/GenerateUniqueString';
import hexToRgba from '@/components/other/HexToRGBA';
import { chatLogs, useChatLogStore } from '@/components/userData/UserChatLogs';
import useTheme from '@/hooks/useTheme';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ContextMenu, { ContextMenuAction } from 'react-native-context-menu-view';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { create } from "zustand";

type ChatStore = {
  creationPromise: Promise<{chatLogs: chatLogs, id: number}> | null,
  currentChatId: number,
  changeCurrentChatId: (chatId: number) => void,
};

export const useChatStore = create<ChatStore>(set => ({
  creationPromise: null,

  currentChatId: -1,

  changeCurrentChatId: (chatId) => {
    set(state => {
      return {...state, currentChatId: chatId}
    })
  },
}));

export default function Index() {
  const chatRef = useRef<ChatRef>(null);
  const chatLogStore = useChatLogStore.getState();

  const [showingChats, changeShowingChats] = useState(false);
  const [chatNameChangingId, changeChatNameChangingId] = useState(-1);
  const [creatingChat, changeCreatingChat] = useState(false);

  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  // Funcs
  const onPressShowChats = () => {
    changeShowingChats(prev => !prev);
  }

  const switchChat = (chatId: number, newChatLogs?: chatLogs) => {
    const chatStore = useChatStore.getState();

    changeShowingChats(false);
    chatStore.changeCurrentChatId(chatId);
    chatRef.current?.setAllMessages((newChatLogs || chatLogStore.chatLogs)[chatId].logs);
  }

  const createNewChat = async () => {
    const chatStore = useChatStore.getState();
    const newId = chatLogStore.chatLogs.length;

    const newChatLogs = [...chatLogStore.chatLogs, {
      name: `Chat: #${newId + 1}`,
      logs: [],
    }];

    await chatLogStore.saveChatLogs(newChatLogs);
    chatStore.changeCurrentChatId(newId);
    switchChat(newId, newChatLogs);

    return {chatLogs: newChatLogs, id: newId};
  }

  const deleteChat = (chatId: number) => {
    Alert.alert(
      "Confirmation:", 
      `Are you sure you want to delete the chat '${chatLogStore.chatLogs[chatId].name}'?\n\nThis action is irreversible.`,
      [
        {
          text: "YES", 
          onPress: () => {
            /*
            const chatStore = useChatStore.getState();

            if (chatStore.currentChatId === chatId){
              chatRef.current?.setAllMessages([]);
              chatStore.changeCurrentChatId(-1);
            }
            */

            const logs = chatLogStore.chatLogs[chatId].logs;

            for (var i = 0; i < logs.length; i++) {
              const v = logs[i];
              if (v.type !== "image") continue;
              RNFS.unlink(v.content);
            }

            const newChatLogs = chatLogStore.chatLogs.filter((_, i) => chatId !== i);
            chatLogStore.saveChatLogs(newChatLogs);
        }},

        {text: "NO"},
      ]
    )
  }

  const onNewMessage = async (msg: messageFormat) => {
    const chatStore = useChatStore.getState();

    let id = chatStore.currentChatId;
    let chatLogs: chatLogs = useChatLogStore.getState().chatLogs;

    if (id === -1){
      if (chatStore.creationPromise === null){
        chatStore.creationPromise = createNewChat();
      }

      const chatInfo = await chatStore.creationPromise;

      id = chatInfo.id;
      chatLogs = chatInfo.chatLogs;
      chatStore.creationPromise = null;
    };

    const newChatLogs = [...chatLogs];
    newChatLogs[id].logs.push(msg);
    chatLogStore.saveChatLogs(newChatLogs);
  }

  useEffect(() => {
    const chatStore = useChatStore.getState();

    if (chatStore.currentChatId === -1) return;

    if (!(chatStore.currentChatId in chatLogStore.chatLogs)){
      chatRef.current?.setAllMessages([]);
      chatStore.changeCurrentChatId(-1);
    }
  }, [useChatLogStore()]);

  // User Chat Options
  const chatOptions = [
    {
      title: "Rename Chat",
      onPress: changeChatNameChangingId,
    },
    {
      title: "Delete Chat",
      onPress: deleteChat,
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
  } || {};

  const currentChatId = useChatStore(state => state.currentChatId);

  return (
    <View style={stylesheet.mainContainer}>
      <SafeAreaView style={stylesheet.container} edges={["top"]}>
        <Chat ref={chatRef} onNewMessage={onNewMessage} showNoMessagesText={currentChatId === -1}/>
      </SafeAreaView>

      <View style={[stylesheet.chooseChatContainer, chooseChatContainer]}>
        <Animated.View style={[stylesheet.allChatsView, {width: width}]}>
          {showingChats ? 
            <SafeAreaView style={[stylesheet.container, {gap: 10}]} edges={["top"]}>
              <TouchableOpacity style={stylesheet.chatOption} onPress={createNewChat}>
                <View style={stylesheet.createChatButton}> 
                  <Image style={stylesheet.fitImage} source={theme.assets.chat}/>
                </View>

                <Text style={stylesheet.chatOptionText}  numberOfLines={1}>Create New Chat</Text>
              </TouchableOpacity>

              <View style={{height: 5}}/>

              <ScrollView>
                <View style={stylesheet.chatOptionsView}>{
                  chatLogStore.chatLogs?.map((v, i) => {
                    return <ChatOption
                      name={v.name}
                      chatId={i}
                      onPress={() => {
                        switchChat(i);
                        changeShowingChats(false);
                      }}
                      onChangedName={(t) => {
                        changeChatNameChangingId(-1);

                        const newChatLogs = [...chatLogStore.chatLogs];
                        newChatLogs[i].name = t;
                        chatLogStore.saveChatLogs(newChatLogs);
                      }}
                      isChangingName={chatNameChangingId === i}
                      chatOptions={chatOptions}
                      key={genUniqueStr(8)}
                    />
                  })
                }</View>
              </ScrollView>
            </SafeAreaView> : null
          }
        </Animated.View>

        <SafeAreaView style={stylesheet.showAllChatsContainer} pointerEvents="box-none">
          <View style={stylesheet.container}>
            <TouchableOpacity 
              style={[
                stylesheet.showAllChatsButton, 
                showingChats ? {paddingRight: 10,} : {paddingLeft: 10,}
              ]} 
              onPress={onPressShowChats}
            >
              <Image 
                style={stylesheet.fitImage} 
                source={showingChats ? theme.assets.leftArrow : theme.assets.rightArrow}
              />
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
  isChangingName?: boolean,
  onPress?: () => void,
  onChangedName?: (text: string) => void,
}

const ChatOption = ({name, chatId, chatOptions, isChangingName, onPress, onChangedName}: ChatOptionProps) => {
  const theme = useTheme();
  const stylesheet = createChatModeStyle(theme);

  const [newChatName, changeNewChatName] = useState(name);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isChangingName) return;
    inputRef.current?.focus();
  }, [isChangingName])

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
            <Image style={stylesheet.fitImage} source={theme.assets.info}/>
          </ContextMenu>
        </TouchableOpacity>
        
        <View style={stylesheet.container} pointerEvents="none">{
          isChangingName ? <TextInput 
            ref={inputRef}
            value={newChatName}
            onChangeText={changeNewChatName}
            onBlur={() => {
              if (!onChangedName) return;
              let finalName = newChatName.trim();
              if (finalName === "") finalName = "[NO-NAME]";
              changeNewChatName(finalName);
              onChangedName(finalName);
            }}
            selectTextOnFocus={false}
            style={stylesheet.chatOptionText} 
            numberOfLines={1}
          /> : <Text
            adjustsFontSizeToFit 
            minimumFontScale={0.7}
            style={stylesheet.chatOptionText} 
          >{newChatName}</Text>
        }</View>
      </TouchableOpacity>
    </View>
  )
}
