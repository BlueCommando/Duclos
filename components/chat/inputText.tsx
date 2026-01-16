import { createChatStyle } from '@/assets/styles/chat.style'
import useTheme from '@/hooks/useTheme'
import React, { useState } from 'react'
import { TextInput, View } from 'react-native'

const InputText = ({onSend}: {onSend: (msg: string) => void}) => {
    // going to be the chat that will send to the ai model

  const colors = useTheme();
  const style = createChatStyle(colors);

  const [msg, updateMsg] = useState("");

  const tellAI = async () => {
    if (!msg.trim()) return
    onSend(msg)
    updateMsg("")
  };

  return (
    <View style={style.inputSection}>
      <View style={style.inputWrapper}>
        <TextInput
          value={msg}
          onChangeText={updateMsg}
          onSubmitEditing={tellAI}

          placeholder='test'
          style={{fontSize: 20}}
        />
      </View>
    </View>
  )
}

export default InputText