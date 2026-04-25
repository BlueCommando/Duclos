import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';
import { Chat, ChatRef } from '@/components/app/Chat';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';

const TempChat = () => {
  const chatSettings = useRef<ChatRef>(null);

  const params = useLocalSearchParams<imageryLocalParams>();
  const { prompt, aiResponse, editedPicturePath, aiResponseTimeUnix } = params;

  // Generate text when creating new chat:
  useEffect(() => {
    const init = async () => {
      const userPromptTime = Date.now() - parseFloat(aiResponseTimeUnix || "0");

      await chatSettings.current?.createMessage({
        role: "sender",
        content: [
          {
            type: "image",
            time: userPromptTime,
            image: {
              type: "uri",
              content: editedPicturePath,
            },
          },
          {
            type: "text",
            time: userPromptTime,
            text: prompt,
          }
        ]
      });

      await chatSettings.current?.createLoadingText();

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

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('ActivityStateChange', (event) => {
      if (event.event === 'onDestroy') {
        chatSettings.current?.deleteAllImages();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (<Chat ref={chatSettings}/>)
}

export default TempChat
