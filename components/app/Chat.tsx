import { createChatStyle } from '@/assets/styles/components/app/chat.style';
import useTheme from '@/hooks/useTheme';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import aiService from '../ai/AiService';
import Markdown from 'react-native-markdown-display';
import Katex from 'react-native-katex';
import ContextMenu from "react-native-context-menu-view";

// Help with react-native-context-menu-view:
// https://github.com/mpiannucci/react-native-context-menu-view
//
// Help with react-native-markdown-display:
// https://github.com/iamacup/react-native-markdown-display/blob/master/README.md
//
// Help with react-native-katex:
// https://github.com/3axap4eHko/react-native-katex/blob/master/README.md
// ^ besides this, there isn't any other documentation.

type allMessagesFormat = messageFormat[];

type messageFormat = {
  role: "sender" | "receiver",
  type: "text" | "image" | "loading",
  content: string,
  time: number,
};

type inputtedMessageFormat = {
  role: "sender" | "receiver",
  content: {
    type: "text" | "image",
    text?: string,
    image?: {
      type?: "uri" | "require" | "base64",
      content?: string,
    },
  }[],
};

const genUniqueStr = (digits: number) =>  {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
    const uuid = [];

    for (let i = 0; i < digits; i++) {
        uuid.push(str[Math.floor(Math.random() * str.length)]);
    }

    return uuid.join('');
};

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
};

type ChatProps = {
  
};

export const Chat = forwardRef<ChatRef, ChatProps>((props, ref) => {
  const [allMessages, changeAllMessages] = useState<allMessagesFormat>([]);
  const [loadingMessage, changeLoadingMessage] = useState(false);
  
  const createMessage = async (action: inputtedMessageFormat) => {
    const finalMessage: allMessagesFormat = [];

    for (var i = 0; i < action.content.length; i++) {
      const context = action.content[i];

      if (context.type === "text"){
        if (!context.text) continue;

        finalMessage.push({
          role: action.role,
          type: context.type,
          content: context.text,
          time: Date.now(),
        });

      } else if (context.type === "image") {
        if (!context.image || !context.image.content) continue;

        const imageText: messageFormat = {
          role: action.role,
          type: context.type,
          content: "",
          time: Date.now(),
        };

        if (context.image.type === "uri" || context.image.type === "require"){
          imageText.content = await aiService.imageToBase64(context.image.content);
        }
        if (context.image.type === "base64"){
          imageText.content = context.image.content;
        }
        
        finalMessage.push(imageText);
      }
    }

    changeAllMessages(prev => [...prev, ...finalMessage]);
  };

  const createLoadingText = () => changeLoadingMessage(true);
  const destroyLoadingText = () => changeLoadingMessage(false);

  const getAllMessages = () => allMessages;

  useImperativeHandle(ref, () => ({
    createMessage,
    createLoadingText,
    destroyLoadingText,
    getAllMessages,
  }));

  const scrollRef = useRef<ScrollView>(null);

  const theme = useTheme();
  const stylesheet = createChatStyle(theme);

  return (
    <ScrollView
      ref={scrollRef}
      onLayout={ () => scrollRef.current?.scrollToEnd({ animated: true }) }
    >
      <View style={stylesheet.chatView}>
        {allMessages.map((v) => {
          return (
            <Bubble 
              message={v}
              key={genUniqueStr(8)}
            />
          )
        })}

        {loadingMessage && (
          <Bubble 
            message={{type: "loading", role: "receiver", content: "NULL", time: Date.now(),}}
            key={genUniqueStr(8)}
          />
        )}
      </View>
    </ScrollView>
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

  const dateClass = new Date(message.time);
  const unix = message.time / 1000;

  const day = dateClass.getDay() + 1;
  const month = dateClass.toLocaleString("default", { month: "short" });
  const year = dateClass.getFullYear();
  const hours = (dateClass.getHours() + 11) % 12 + 1;
  const minutes = String(Math.floor(unix / 60 % 60)).padStart(2, "0");
  const AMPM = dateClass.getHours() - 11 < 12 ? 'PM' : 'AM';

  return (
    <View style={stylesheet.bubbleView}>
      <View style={[stylesheet.globalBubble, bubbleType]}>
        {
          message.type === "text" 
            ? <View style={stylesheet.textView}>
                {texts.map((v) => {
                  if (v.type === "markdown") return <Markdown key={genUniqueStr(8)}>{v.content}</Markdown>;
                  if (v.type === "katex"){
                    return <View key={genUniqueStr(8)} style={stylesheet.katexView}>
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

      {(message.type !== "loading") && (
        <View style={[stylesheet.globalBubbleInfoView, bubbleInfoType, {flexDirection: bubbleInfoDir}]}>
          <Text style={stylesheet.bubbleInfoTimeText}>
            {`${month} ${day} ${year}, ${hours}:${minutes} ${AMPM}`}
          </Text>

          <TouchableOpacity style={stylesheet.bubbleInfoButton}>
            <Image 
              style={stylesheet.bubbleInfoButtonImage} 
              source={require("@/assets/app/PLACEHOLDER.png")}
            />
          </TouchableOpacity>
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
