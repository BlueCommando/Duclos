import { imageryLocalParams } from '@/assets/styles/screens/imagery/ImageryLocalParam';
import { Chat, ChatRef } from '@/components/app/Chat';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

const TempChat = () => {
  const chatSettings = useRef<ChatRef>(null);

  const params = useLocalSearchParams<imageryLocalParams>();
  const { prompt, aiResponse, aiResponseTimeUnix, editedPicturePath } = params;

  const t = aiResponseTimeUnix && parseFloat(aiResponseTimeUnix) || 1;
  alert(`TOOK: ${Math.floor(t/60/60)} Hours, ${Math.floor(t/60)} Minutes, ${Math.floor(t%60)} Seconds!\n(Unix: ${t})`);

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
    })

    chatSettings.current?.createMessage({
      role: "receiver",
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
          text: aiResponse,
        }
      ]
    })

    chatSettings.current?.createLoadingText()
  }, [])

  return (
    <View>
      <Chat ref={chatSettings}/>
    </View>
  )
}

export default TempChat
