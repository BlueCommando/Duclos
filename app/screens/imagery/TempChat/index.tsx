import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';
import AiService from '@/components/ai/AiService';
import { Chat, ChatRef } from '@/components/app/Chat';
import ChatInput, { ChatSentMessageExample } from '@/components/app/ChatInput';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TempChat = () => {
  const chatSettings = useRef<ChatRef>(null);

  const params = useLocalSearchParams<imageryLocalParams>();
  const { prompt, aiResponse, editedPicturePath } = params;

  // Generate text when creating new chat:
  useEffect(() => {
    chatSettings.current?.createMessage({
      role: "sender",
      content: [
        {
          type: "image",
          image: {
            type: "base64",
            content: editedPicturePath,
          },
        },
        {
          type: "text",
          text: prompt,
        }
      ]
    });

    chatSettings.current?.createLoadingText()

    setTimeout(() => {
      chatSettings.current?.destroyLoadingText();

      chatSettings.current?.createMessage({
        role: "receiver",
        content: [
          {
            type: "text",
            text: aiResponse,
          }
        ]
      });
    }, 3000);
  }, []);

  // Texting:
  const [text, changeText] = useState("");
  const [canText, changeCanText] = useState(true);

  const onSend = async (message: ChatSentMessageExample) => {
    if (!canText) return;
    changeCanText(false);
    changeText("");

    // Create for messages for the chat and AI
    const imageMessages = [];
    const imageAiMessages = [];

    for (var i = 0; i < message.images.length; i++) {
      const v = message.images[i]

      imageMessages.push({
        type: "image" as "image",
        image: {
          type: "base64" as "base64",
          content: v,
        },
      });

      imageAiMessages.push({
        type: "image_url",
        image_url: {
          url: v,
        },
      })
    }

    // Chat
    chatSettings.current?.createMessage({
        role: "sender",
        content: [
          ...imageMessages,
          {
            type: "text",
            text: message.text,
          },
        ]
    });

    setTimeout(() => chatSettings.current?.createLoadingText(), 1000);

    console.log("loading")

    // AI
    const response = await AiService.imageCompletion({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message.text,
            },
            ...imageAiMessages,
          ],
        }
      ],
    });

    console.log(response.text)

    chatSettings.current?.destroyLoadingText();
    
    chatSettings.current?.createMessage({
        role: "receiver",
        content: [
          {
            type: "text",
            text: response.text,
          }
        ]
    });

    changeCanText(true);
  };

  // Destroy files upon leaving:
  useFocusEffect(
    useCallback(() => {
      return () => {
        //if (picturePath) RNFS.unlink(picturePath);
        //if (editedPicturePath) RNFS.unlink(editedPicturePath);
      };
    }, []),
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      style={{flex: 1}}
    >
      <Chat ref={chatSettings}/>
      <SafeAreaView edges={['bottom']}>
        <View>
          <ChatInput
            text={text}
            onChangedText={changeText}
            onSend={onSend}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default TempChat
