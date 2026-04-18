import appSettings from '@/assets/appSettings';
import { createChatInputStyle } from '@/assets/styles/components/app/chatInput.style';
import useTheme from '@/hooks/useTheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, LayoutChangeEvent, TextInput, TouchableOpacity, View } from 'react-native';
import ContextMenu, { ContextMenuAction } from "react-native-context-menu-view";
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';

// Help with react-native-simple-toast:
// https://github.com/vonovak/react-native-simple-toast/blob/master/README.md
//
// Help with react-native-image-picker:
// https://github.com/react-native-image-picker/react-native-image-picker/blob/main/README.md
//
// Help with react-native-context-menu-view:
// https://github.com/mpiannucci/react-native-context-menu-view/blob/main/README.md

export type ChatSentMessageExample = {
  text: string,
  images: string[],
};

type ChatInputProps = {
  text?: string,
  onChangedText?: (text: string) => void,
  onSend?: (sent: ChatSentMessageExample | undefined) => void,
};

const ChatInput = ({text, onChangedText, onSend}: ChatInputProps) => {
  const theme = useTheme();
  const stylesheet = createChatInputStyle(theme);

  const [chatSend, changeChatSend] = useState<ChatSentMessageExample>({text: "", images: [],})
  const [borderRadius, setBorderRadius] = useState(0);
  const [height, setHeight] = useState(stylesheet.container.height);

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);

    if (borderRadius === 0) setBorderRadius(e.nativeEvent.layout.height / 2);
  };

  return (
    <View style={[stylesheet.container, {height: height}]}>
      <ChatAttach
        attachmentCount={chatSend.images.length}
        onAttach={(base64) => {
          changeChatSend(prev => ({
            ...prev,
            images: [
              ...prev.images,
              base64,
            ]
          }));
        }}
      />

      <View 
        onLayout={onLayout} 
        style={[stylesheet.textInputContainer, {borderRadius: borderRadius}]}
      >

        <TextInput
          style={stylesheet.textInput}
          value={text}
          onChangeText={(t) => {
            if (onChangedText) onChangedText(t);

            changeChatSend(prev => ({
              ...prev,
              text: t,
            }));
          }}
          onContentSizeChange={(e) => {
            const height = e.nativeEvent.contentSize.height;
            const maxHeight = stylesheet.container.maxHeight;

            setHeight(Math.min(height, maxHeight))
          }}
          multiline={true}
          placeholder="Click to type a Message to AI"
        />
      </View>

      <ChatSend onPress={() => {
        if (!onSend) return;
        onSend(chatSend);
      }}/>
    </View>
  )
}

type ChatAttackProps = {
  attachmentCount: number,
  onAttach?: (base64: string) => void,
};

type AttachOption = (ContextMenuAction & {
  onPress?: () => void
});

const ChatAttach = ({attachmentCount, onAttach}: ChatAttackProps) => {
  const theme = useTheme();
  const stylesheet = createChatInputStyle(theme);

  const attachOptions: AttachOption[] = [

    // From Gallery
    {
      title: "Attach Image from Gallary",
      onPress: async () => {
        if (!onAttach) return;

        const photos = await launchImageLibrary({
          mediaType: "photo",
          includeBase64: true,
        });

        if (photos.didCancel || !photos.assets) return;

        onAttach(photos.assets[0].base64 || "");
      },
    },

    // From Camera
    {
      title: "Attach Image from Camera",
      onPress: () => {
        if (!onAttach) return;

        router.push("/screens/TakePhoto")
        console.log("now thats tuff2")
      },
    },
  ];

  return (
    <View style={stylesheet.centerContainer}>
      <View style={[stylesheet.attachImageView, {height: stylesheet.container.height * 0.8}]}>
          <ContextMenu
            actions={attachOptions}
            dropdownMenuMode={true}
            onPress={(e) => {
              if (attachmentCount >= appSettings.text.attachmentLimit){
                Toast.show(`Attachment Limit Reached! (${appSettings.text.attachmentLimit})`, 3000);
                return;
              }

              const onPress = attachOptions[e.nativeEvent.index].onPress;
              if (!onPress) return;
              onPress();
            }}
          >
            <Image 
              style={stylesheet.attachButtonImage} 
              source={require("@/assets/app/PLACEHOLDER.png")}
            />
          </ContextMenu>
        </View>
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
    <View style={stylesheet.centerContainer}>
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
