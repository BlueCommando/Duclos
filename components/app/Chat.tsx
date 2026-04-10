import { createChatStyle } from '@/assets/styles/components/app/chat.style';
import useTheme from '@/hooks/useTheme';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Text, View, ScrollView } from 'react-native';
import AiService from '../ai/AiService';

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

export type ChatRef = {
  createMessage: (action: inputtedMessageFormat) => void,
  createLoadingText: () => void,
  destroyLoadingText: () => void,
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
          imageText.content = await AiService.imageToBase64(context.image.content);
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

  useImperativeHandle(ref, () => ({
    createMessage,
    createLoadingText,
    destroyLoadingText,
  }));

  const theme = useTheme();
  const stylesheet = createChatStyle(theme);

  return (
    <ScrollView>
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
         ? <View style={stylesheet.loadingBubble}>
          {/*Anim here*/}
          <Text onLayout={() => console.log("tuffffff!")}>432432432</Text>
        </View>

        : <Text>'MESSAGE.TYPE' IS AT AN UNKNOWN VALUE. PLEASE REPORT!</Text>
      }
    </View>
  )
}
