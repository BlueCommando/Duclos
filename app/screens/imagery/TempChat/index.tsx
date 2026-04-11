import { imageryLocalParams } from '@/assets/styles/screens/imagery/ImageryLocalParam';
import { Chat, ChatRef } from '@/components/app/Chat';
import ChatInput from '@/components/app/ChatInput';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';

const TempChat = () => {
  const chatSettings = useRef<ChatRef>(null);

  const params = useLocalSearchParams<imageryLocalParams>();
  const { prompt, aiResponse, aiResponseTimeUnix, picturePath, editedPicturePath } = params;

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
          <ChatInput/>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default TempChat
