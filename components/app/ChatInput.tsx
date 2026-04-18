import appSettings from '@/assets/appSettings';
import { createChatInputStyle } from '@/assets/styles/components/app/chatInput.style';
import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';
import generateUniqueString from '@/components/other/GenerateUniqueString';
import useTheme from '@/hooks/useTheme';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, LayoutChangeEvent, TextInput, TouchableOpacity, View } from 'react-native';
import ContextMenu, { ContextMenuAction } from "react-native-context-menu-view";
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { create } from "zustand";
import AiService from '../ai/AiService';

// Help with zustand:
// https://zustand.docs.pmnd.rs/learn/getting-started/introduction#installation
//
// Help with react-native-simple-toast:
// https://github.com/vonovak/react-native-simple-toast/blob/master/README.md
//
// Help with react-native-image-picker:
// https://github.com/react-native-image-picker/react-native-image-picker/blob/main/README.md
//
// Help with react-native-context-menu-view:
// https://github.com/mpiannucci/react-native-context-menu-view/blob/main/README.md

// there might be a bug where the crop screen box can be bigger than the displayed image?

export type chatInputImageryParams = imageryLocalParams & {id: string}

type ImageryStore = {
  imageryProps: chatInputImageryParams[];
  addImagery: (params: chatInputImageryParams) => void;
};

export const useImageryStore = create<ImageryStore>(set => ({
  imageryProps: [] as chatInputImageryParams[],

  addImagery: (params: chatInputImageryParams) =>
    set(state => ({
      imageryProps: [...state.imageryProps, params],
    })),
}));

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
  const [uniqueId] = useState(generateUniqueString(8));

  const [borderRadius, setBorderRadius] = useState(0);
  const [height, setHeight] = useState(stylesheet.container.height);

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);

    if (borderRadius === 0) setBorderRadius(e.nativeEvent.layout.height / 2);
  };

  return (
    <View style={[stylesheet.container, {height: height}]}>
      <ChatAttach
        uniqueId={uniqueId}
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
  uniqueId: string,
  attachmentCount: number,
  onAttach?: (base64: string) => void,
};

type AttachOption = (ContextMenuAction & {
  onPress?: () => void
});

const ChatAttach = ({uniqueId, attachmentCount, onAttach}: ChatAttackProps) => {
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

        // Will get photos in a useEffect.
        router.push({
          pathname: "/screens/TakePhotoChat",
          params: {id: uniqueId},
        })
      },
    },
  ];

  // From Camera Continued:
  const imageryProps = useImageryStore(state => state.imageryProps);

  useEffect(() => {
    if (!onAttach) return;

    const run = async () => {
      for (var i = 0; i < imageryProps.length; i++) {
        const v = imageryProps[i];
        if (v.id !== uniqueId) continue;
        if (!v.editedPicturePath) continue;

        const base64 = await AiService.imageToBase64(v.editedPicturePath, true);
        onAttach(base64);

        break;
      }
    };

    run();
  }, [imageryProps])

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
