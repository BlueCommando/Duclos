import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { messageFormat } from '@/components/app/Chat';

const getChatId = () => 23

const test = () => {
  
  const [currentChatId, changeCurrentChatId] = useState<number | null>(null);
  const [pendingMessage, setPendingMessage] = useState<messageFormat | null>(null);

  const switchChat = (chatId: number) => {
    changeCurrentChatId(chatId)
  }

  const createNewChat = () => {
    const newChatId = getChatId();
    switchChat(newChatId)
  }

  const onNewMessage = (msg: messageFormat) => {
    if (currentChatId === null){ // 'currentChatId' is always null in here?
      createNewChat();
      setPendingMessage(msg);
      return;
    }
  }

  return (
    <View>
      <Text>test</Text>
    </View>
  )
}

export default test