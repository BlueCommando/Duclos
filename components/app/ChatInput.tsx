import { View, Text, TextInput, LayoutChangeEvent } from 'react-native'
import React, { useRef, useState } from 'react'
import useTheme from '@/hooks/useTheme'
import { createChatInputStyle } from '@/assets/styles/components/app/chatInput.style';

type ChatInputProps = {
  onChangedText?: (event: string) => void,
}

const ChatInput = ({onChangedText}: ChatInputProps) => {
  const theme = useTheme();
  const stylesheet = createChatInputStyle(theme);

  const [borderRadius, setBorderRadius] = useState(0);
  const [height, setHeight] = useState(stylesheet.container.height);

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);

    if (borderRadius === 0) setBorderRadius(e.nativeEvent.layout.height / 2);
  };

  console.log(height)

  return (
    <View style={[stylesheet.container, {height: height}]}>
      <View 
        onLayout={onLayout} 
        style={[stylesheet.textInputContainer, {borderRadius: borderRadius}]}
      >
        <TextInput
          style={stylesheet.textInput}
          onChangeText={onChangedText}
          onContentSizeChange={(e) => {
            const height = e.nativeEvent.contentSize.height;
            const maxHeight = stylesheet.container.maxHeight;

            setHeight(Math.min(height, maxHeight))
          }}
          multiline={true}
          placeholder="Click to type a Message to AI"
        />
      </View>
    </View>
  )
}

export default ChatInput