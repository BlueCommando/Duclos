import { createChatStyle } from '@/assets/styles/components/app/chat.style';
import useTheme from '@/hooks/useTheme';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Image, ScrollView, Text, View } from 'react-native';
import aiService from '../ai/AiService';

type allMessagesFormat = messageFormat[];

type messageFormat = {
  role: "sender" | "receiver",
  type: "text" | "image" | "loading",
  content: string,
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
        });

      } else if (context.type === "image") {
        if (!context.image || !context.image.content) continue;

        const imageText: messageFormat = {
          role: action.role,
          type: context.type,
          content: "",
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
            message={{type: "loading", role: "receiver", content: "NULL"}}
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

const Bubble = ({message}: BubbleProps) => {
  const theme = useTheme();
  const stylesheet = createChatStyle(theme);

  const bubbleType = message.role === "sender" ? stylesheet.senderBubble : stylesheet.reciverBubble

  return (
    <View style={[stylesheet.globalBubble, bubbleType]}>
      {
        message.type === "text" 
          ? <View style={stylesheet.textView}>
              <Text style={stylesheet.textBubble}>{message.content}</Text>
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
