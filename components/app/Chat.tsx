import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Text, View } from 'react-native';
import AiService from '../ai/AiService';

type allMessagesFormat = [messageFormat?];

type messageFormat = {
  role: "sender" | "receiver",
  type: "text" | "image",
  content: string,
};

type inputtedMessageFormat = {
  role: "sender" | "receiver",
  content: [
    {
      type: "text" | "image",
      text?: string,
      image?: {
        type?: "uri" | "require" | "base64",
        content?: string,
      },
    }
  ],
};

export type ChatRef = {
  createMessage: (action: inputtedMessageFormat) => void
};

type ChatProps = {
  
};

export const Chat = forwardRef<ChatRef, ChatProps>((props, ref) => {
  const [allMessages, changeAllMessages] = useState<allMessagesFormat>([]);
  
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

    changeAllMessages(prev => {
      return prev;
    });
  };

  useImperativeHandle(ref, () => ({
    createMessage,
  }));

  return (
    <View>
      <Text>aiResponse</Text>
    </View>
  );
})
