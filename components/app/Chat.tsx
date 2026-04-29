import { createChatStyle } from '@/assets/styles/components/app/chat.style';
import generateUniqueString from '@/components/other/GenerateUniqueString';
import useTheme from '@/hooks/useTheme';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Clipboard from '@react-native-clipboard/clipboard';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Alert, Animated, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import ContextMenu, { ContextMenuAction } from "react-native-context-menu-view";
import RNFS from 'react-native-fs';
import Katex from 'react-native-katex';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import aiService from '../ai/AiService';
import hasAndroidPermission from '../other/HasAndroidPermission';
import ChatInput, { ChatInputRef, ChatSentMessageExample } from './ChatInput';

// Help with react-native-simple-toast:
// https://github.com/vonovak/react-native-simple-toast/blob/master/README.md
//
// Help with react-native-camera-roll/camera-roll:
// https://github.com/react-native-cameraroll/react-native-cameraroll/blob/master/README.md
// 
// Help with react-native-clipboard:
// https://github.com/react-native-clipboard/clipboard/blob/master/README.md
//
// Help with react-native-context-menu-view:
// https://github.com/mpiannucci/react-native-context-menu-view/blob/main/README.md
//
// Help with react-native-markdown-display:
// https://github.com/iamacup/react-native-markdown-display/blob/master/README.md
//
// Help with react-native-katex:
// https://github.com/3axap4eHko/react-native-katex/blob/master/README.md
// ^ besides this, there isn't any other documentation.

type allMessagesFormat = messageFormat[];

export type messageFormat = {
  role: "sender" | "receiver",
  type: "text" | "image" | "loading",
  content: string,
  time: number,
};

type inputtedMessageFormat = {
  role: "sender" | "receiver",
  content: {
    type: "text" | "image",
    time?: number,
    text?: string,
    image?: {
      type?: "uri" | "require" | "base64",
      content?: string,
    },
  }[],
};

type infoContextButtonEvent = {
  name: string,
  index: number,
  message: messageFormat,
}

type infoContextButtonFormat = {
  title: string,
  onPress?: (event: infoContextButtonEvent) => void,
};

const globalContextButtons: infoContextButtonFormat[] = [];
const textContextButtons: infoContextButtonFormat[] = [
  {
    title: "Copy text",
    onPress: (e) => {
      Clipboard.setString(e.message.content);
      Toast.show("Copied Text to Clipboard Successfully!", 3000);
    }
  },
];
const imageContextButtons: infoContextButtonFormat[] = [
  {
    title: "Download Image",
    onPress: async (e) => {
      // Permissions
      if (Platform.OS === "android" && !(await hasAndroidPermission())){
        Alert.alert(
          "Permissions Required", 
          "Accept the asked permission to download the image.",
          [
            {
              text: "OK",
            },
          ]
        );
        return;
      }

      // Save:
      await CameraRoll.saveAsset(e.message.content, { type: "photo" });

      Toast.show("Downloaded Image Successfully!", 3000);
    }
  },
];

const inlineStyle = `
html, body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}

.katex {
  font-size: 50px;
  margin: 0;
  display: flex;
}
`;

// Chatbox:

export type ChatRef = {
  createMessage: (action: inputtedMessageFormat) => void,
  createLoadingText: () => void,
  destroyLoadingText: () => void,
  getAllMessages: () => allMessagesFormat,
  setAllMessages: (messages: allMessagesFormat) => void,
  deleteAllImages: () => void,
};

type ChatProps = {
  showNoMessagesText?: boolean,
  onNewMessage?: (msg: messageFormat) => void,
};

export const Chat = forwardRef<ChatRef, ChatProps>((props, ref) => {
  const [allMessages, changeAllMessages] = useState<allMessagesFormat>([]);
  const [loadingMessage, changeLoadingMessage] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const createMessage = async (action: inputtedMessageFormat) => {
    const finalMessage: allMessagesFormat = [];

    for (var i = 0; i < action.content.length; i++) {
      const context = action.content[i];

      if (context.type === "text"){
        if (!context.text) continue;
        if (context.text.trim() === "") continue;

        finalMessage.push({
          role: action.role,
          type: context.type,
          content: context.text,
          time: context.time || Date.now(),
        });

      } else if (context.type === "image") {
        if (!context.image || !context.image.content) continue;

        const imageText: messageFormat = {
          role: action.role,
          type: context.type,
          content: "",
          time: context.time || Date.now(),
        };

        if (context.image.type === "uri"){
          imageText.content = context.image.content;
        }

        if (context.image.type === "require"){
          const base64 = await aiService.imageToBase64(context.image.content, true);
          const path = `${RNFS.CachesDirectoryPath}/${generateUniqueString(8)}.jpg`;

          await RNFS.writeFile(path, base64, "base64");

          imageText.content = "file://" + path;
        }

        if (context.image.type === "base64"){
          const path = `${RNFS.CachesDirectoryPath}/${generateUniqueString(8)}.jpg`;
          const formatedBase64 = await aiService.removeImageBase64Prefix(context.image.content);

          await RNFS.writeFile(path, formatedBase64, "base64");

          imageText.content = "file://" + path;
        }
        
        finalMessage.push(imageText);
      }
    }

    changeAllMessages(prev => [...prev, ...finalMessage]);

    if (props.onNewMessage){
      for (var i = 0; i < finalMessage.length; i++) {
        props.onNewMessage(finalMessage[i]);
      }
    }
  };

  const deleteAllImages = async () => {
    for (var i = 0; i < allMessages.length; i++) {
      const v = allMessages[i];
      if (v.type !== "image") continue;
      await RNFS.unlink(v.content);
    }
  };

  const createLoadingText = () => changeLoadingMessage(true);
  const destroyLoadingText = () => changeLoadingMessage(false);

  const getAllMessages = () => allMessages;
  const setAllMessages = (m: allMessagesFormat) => changeAllMessages(m);

  useImperativeHandle(ref, () => ({
    createMessage,
    createLoadingText,
    destroyLoadingText,
    getAllMessages,
    setAllMessages,
    deleteAllImages,
  }));

  const chatInputRef = useRef<ChatInputRef>(null);

  const onSend = async (message: ChatSentMessageExample) => {
    if (!chatInputRef.current) return;

    chatInputRef.current.canSendMessages(false);

    // Users Input:
    const userImages = [];

    for (var i = 0; i < message.images.length; i++) {
      userImages.push({
        type: "image" as "image",
        image: {
          type: "uri" as "uri",
          content: message.images[i]
        },
      })
    }

    await createMessage({
      role: "sender",
      content: [
        ...userImages,
        {
          type: "text",
          text: message.text,
        },
      ]
    });

    setTimeout(() => createLoadingText(), 1000);

    // Ai's response
    const response = await chatInputRef.current.genAisResponse();

    await createMessage({
      role: "receiver",
      content: [
        {
          type: "text",
          text: response,
        }
      ]
    });

    destroyLoadingText();

    chatInputRef.current.canSendMessages(true);
  }

  const theme = useTheme();
  const stylesheet = createChatStyle(theme);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      style={stylesheet.container}
    >
      {/*Chat*/}
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={stylesheet.chatView}>
          {allMessages.map((v) => {
            return (
              <Bubble 
                message={v}
                key={generateUniqueString(8)}
              />
            )
          })}

          {loadingMessage ? (
            <Bubble 
              message={{type: "loading", role: "receiver", content: "NULL", time: Date.now(),}}
              key={generateUniqueString(8)}
            />
          ) : null}
        </View>
      </ScrollView>

      {(allMessages.length === 0 && props.showNoMessagesText) ? (
        <Text style={stylesheet.noMessagesText}>{`Type a Message to create a new Chat.\nOr go to an old Chat.`}</Text>
      ): null}

      {/*Chat Input*/}
      <SafeAreaView style={stylesheet.safeChatInputView} edges={["bottom"]}>
        <ChatInput
          ref={chatInputRef}
          onSend={onSend}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
})

// Text Bubble:

type BubbleProps = {
  message: messageFormat,
}

type textFormat = {
  type: "markdown" | "katex",
  content: string,
}

const Bubble = ({message}: BubbleProps) => {
  const theme = useTheme();
  const stylesheet = createChatStyle(theme);

  const bubbleType = message.type !== "loading" 
    ? (message.role === "sender" ? stylesheet.senderBubble : stylesheet.reciverBubble)
    : stylesheet.reciverLoadingBubble;

  const bubbleInfoType = message.role === "sender" 
   ? stylesheet.senderBubbleInfoView 
   : stylesheet.reciverBubbleInfoView;
  
  const bubbleInfoDir = message.role === "sender" 
   ? "row" 
   : "row-reverse";

  const texts: textFormat[] = []

  if (message.type === "text"){
    // "\[" means in a equation (use katex)
    // "\]" means we're done with the equation (go back to markdown)

    let curEscChar = ""
    let content = ""

    for (let i = 0; i < message.content.length; i++) {
      const char = message.content[i];
      curEscChar += char;

      if (char === "\\") curEscChar += message.content[i + 1] || "";

      const isEnteringEqu = curEscChar === "\\[";
      const isExitingEqu = curEscChar === "\\]";

      if (isEnteringEqu || isExitingEqu){

        texts.push({
          type: isEnteringEqu && "markdown" || "katex",
          content: content,
        })
        curEscChar = "";
        content = "";
        i++;

      } else {

        content += char;
        curEscChar = "";

      };
    };

    if (content !== ""){
      texts.push({
        type: "markdown",
        content: content,
      })
    }
  }

  // Context buttons:
  const contentButtons: infoContextButtonFormat[] = message.type === "text"
    && [...globalContextButtons, ...textContextButtons]
    || message.type === "image"
    && [...globalContextButtons, ...imageContextButtons]
    || [...globalContextButtons];

  const actionButtons: ContextMenuAction[] = [];

  for (var i = 0; i < contentButtons.length; i++) {
    actionButtons.push({title: contentButtons[i].title,})
  }

  // Time:
  const dateClass = new Date(message.time);
  const unix = message.time / 1000;

  const day = dateClass.getDate();
  const month = dateClass.toLocaleString("default", { month: "short" });
  const year = dateClass.getFullYear();
  const hours = (dateClass.getHours() + 11) % 12 + 1;
  const minutes = String(Math.floor(unix / 60 % 60)).padStart(2, "0");
  const AMPM = dateClass.getHours() < 12 ? 'AM' : 'PM';

  return (
    <View style={stylesheet.bubbleView}>
      {/*The Bubble:*/}
      <View style={[stylesheet.globalBubble, bubbleType]}>
        {
          message.type === "text" 
            ? <View style={stylesheet.textView}>
                {texts.map((v) => {
                  if (v.type === "markdown"){
                    return <Markdown key={generateUniqueString(8)}>
                      {v.content}
                    </Markdown>;
                  }

                  if (v.type === "katex"){
                    return <View key={generateUniqueString(8)} style={stylesheet.katexView}>
                      <Katex 
                        style={stylesheet.katex}
                        expression={v.content}
                        inlineStyle={inlineStyle}
                        displayMode={false}
                        throwOnError={false}
                        errorColor="#f00"
                      />
                    </View>
                  }
                })}
              </View>

          : message.type === "image"
            ? <View style={stylesheet.imageView}>
              <Image style={stylesheet.imageBubble} source={{uri: message.content}}/>
            </View>

          : message.type === "loading"
          ? <View style={stylesheet.loadingBubbleView}>
              <LoadingBubble offsetAlpha={0}/>
              <LoadingBubble offsetAlpha={0.33}/>
              <LoadingBubble offsetAlpha={0.66}/>
            </View>

          : <Text>'MESSAGE.TYPE' IS AT AN UNKNOWN VALUE. PLEASE REPORT!</Text>
        }
      </View>

      {/*Info Button:*/}
      {(message.type !== "loading") && (
        <View style={[stylesheet.globalBubbleInfoView, bubbleInfoType, {flexDirection: bubbleInfoDir}]}>
          <Text style={stylesheet.bubbleInfoTimeText}>
            {`${month} ${day} ${year}, ${hours}:${minutes} ${AMPM}`}
          </Text>

          <ContextMenu
            actions={actionButtons}
            dropdownMenuMode={true}
            onPress={(e) => {
              const realContext = contentButtons[e.nativeEvent.index];
              if (!realContext.onPress) return;

              realContext.onPress({
                name: e.nativeEvent.name, 
                index: e.nativeEvent.index,
                message: message,
              })
            }}
            style={stylesheet.bubbleInfoButton}
          >
            <Image 
              style={stylesheet.bubbleInfoButtonImage} 
              source={require("@/assets/app/PLACEHOLDER.png")}
            />
          </ContextMenu>
        </View>
      )}
    </View>
  )
};

// Loading Bubble:

type LoadingBubbleProps = {
  offsetAlpha?: number,
  yAnim?: number
}

const defaultYAnim = 5

const LoadingBubble = ({offsetAlpha, yAnim}: LoadingBubbleProps) => {
  yAnim = yAnim || defaultYAnim;

  const theme = useTheme();
  const stylesheet = createChatStyle(theme);
  
  const [yOffset, setYOffset] = useState<number>(yAnim * 2 * (offsetAlpha || 1) - yAnim);
  const y = useRef(new Animated.Value(yOffset)).current;

  useEffect(() => {
    const curYOffset = yOffset >= 0 ? -yAnim : yAnim;
    const distance = Math.abs(curYOffset - yOffset);

    y.setValue(curYOffset);
    y.stopAnimation();

    Animated.timing(y, {
      toValue: yOffset || 0,
      duration: (distance / 10) * 1000,
      useNativeDriver: true,
    }).start(() => setYOffset(prev => prev >= 0 ? -yAnim : yAnim));
  }, [yOffset]);

  return (
    <Animated.View
      style={[ stylesheet.loadingBubble, {
        transform: [
          {translateY: y,},
        ],
      }]}
    />
  );
}
