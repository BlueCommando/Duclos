import { createChatInputStyle } from '@/assets/styles/components/app/chatInput.style';
import useTheme from '@/hooks/useTheme';
import React, { useState } from 'react';
import { Image, LayoutChangeEvent, TextInput, TouchableOpacity, View } from 'react-native';

type ChatInputProps = {
  text?: string,
  onChangedText?: (event: string) => void,
  onSend?: () => void,
}

const ChatInput = ({text, onChangedText, onSend}: ChatInputProps) => {
  const theme = useTheme();
  const stylesheet = createChatInputStyle(theme);

  const [borderRadius, setBorderRadius] = useState(0);
  const [height, setHeight] = useState(stylesheet.container.height);

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);

    if (borderRadius === 0) setBorderRadius(e.nativeEvent.layout.height / 2);
  };

  return (
    <View style={[stylesheet.container, {height: height}]}>
      <View 
        onLayout={onLayout} 
        style={[stylesheet.textInputContainer, {borderRadius: borderRadius}]}
      >
        <TextInput
          style={stylesheet.textInput}
          value={text}
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
      <ChatSend onPress={onSend}/>
    </View>
  )
}

type ChatSendProps = {
  onPress?: () => void,
}

const ChatSend = ({onPress}: ChatSendProps) => {
  const theme = useTheme();
  const stylesheet = createChatInputStyle(theme);

  return (
    <View style={stylesheet.sendContainer}>
      <View style={{height: stylesheet.container.height * 0.8}}>
        <View style={stylesheet.sendView}>
          <TouchableOpacity style={stylesheet.sendTouchOpacity} onPress={onPress}>
            <Image style={stylesheet.image} source={require("@/assets/app/PLACEHOLDER.png")}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChatInput
