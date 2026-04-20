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
    const init = async () => {
      await chatSettings.current?.createMessage({
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

      await chatSettings.current?.createLoadingText()

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
    };

    init();
  }, []);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      style={{flex: 1}}
    >
      <Chat ref={chatSettings}/>
    </KeyboardAvoidingView>
  )
}

export default TempChat
