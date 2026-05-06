import appSettings from '@/assets/appSettings';
import { createChatInputStyle } from '@/assets/styles/components/app/chatInput.style';
import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';
import generateUniqueString from '@/components/other/GenerateUniqueString';
import { useSettingsStore } from '@/components/userData/UserSettings';
import useTheme from '@/hooks/useTheme';
import { router } from 'expo-router';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import ContextMenu, { ContextMenuAction } from "react-native-context-menu-view";
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { create } from "zustand";
import AiService from '../ai/AiService';
import { messageFormat } from './Chat';

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

export type chatInputImageryParams = imageryLocalParams & {
  id: string, 
  displayed: "true" | "false"
}

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

export type ChatInputRef = {
  genAisResponse: (allMessages: messageFormat[]) => Promise<string>,
  canSendMessages: (state: boolean) => void,
};

type ChatInputProps = {
  text?: string,
  onChangedText?: (text: string) => void,
  onSend?: (message: ChatSentMessageExample) => void,
};

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>((props, ref) => {
  const {text, onChangedText, onSend} = props;

  const theme = useTheme();
  const stylesheet = createChatInputStyle(theme);

  const [localText, changeLocalText] = useState(text || "");
  const [chatSend, changeChatSend] = useState<ChatSentMessageExample>({text: "", images: [],})
  const [uniqueId] = useState(generateUniqueString(8));
  const [canSend, changeCanSend] = useState(true);

  const [textHeight, setTextHeight] = useState(stylesheet.container.height);
  const [imageHeight, setImageHeight] = useState(0);

  const maxInputHeight = stylesheet.container.maxHeight;

  const genAisResponse = async (allMessages: messageFormat[]) => {
    const images = [];

    for (var i = 0; i < chatSend.images.length; i++) {
      const base64 = await AiService.imageToBase64(chatSend.images[i])

      images.push({
        type: "image_url",
        image_url: {
          url: base64,
        },
      })
    }

    const settingsStore = useSettingsStore.getState();

    let pastMessages = "The Following is the history of a conversation between you and the user:\n";
    let readMessages = 0;

    if (settingsStore.settings.conversationContext){
      for (var i = allMessages.length - 1; i >= 0; i--) {
        if (readMessages >= appSettings.ai.rereadPastMessagesLimit) break;

        const message = allMessages[i];

        if (message.type !== "text") continue;

        const role = message.role === "receiver" 
          && "You" 
          || message.role === "sender" 
          && "User" 
          || "Unknown";

        const dateClass = new Date(message.time);
        const unix = message.time / 1000;
        const day = dateClass.getDate();
        const month = dateClass.toLocaleString("default", { month: "short" });
        const year = dateClass.getFullYear();
        const hours = (dateClass.getHours() + 11) % 12 + 1;
        const minutes = String(Math.floor(unix / 60 % 60)).padStart(2, "0");
        const AMPM = dateClass.getHours() < 12 ? 'AM' : 'PM';
        const fullTime = `${month} ${day} ${year}, ${hours}:${minutes} ${AMPM}`;

        pastMessages += `Role: ${role}\nTime: ${fullTime}\nText: ${message.content}\n\n`
        readMessages++;
      }
    }

    const response = AiService.imageCompletion({
      messages: [
        {
          role: "administrator",
          content: [
            ...(
              readMessages !== 0 && [{
                type: "text",
                text: pastMessages,
              }] || []
            ),
          ],
        },
        {
          role: "user",
          content: [
            ...images,
            ...(
              chatSend.text.trim() !== "" && [{
                type: "text",
                text: chatSend.text,
              }] || []
            ),
          ],
        },
      ],
    });

    changeChatSend({text: "", images: []});
    setTextHeight(stylesheet.container.height);

    return (await response).text;
  }

  useImperativeHandle(ref, () => ({
    genAisResponse: genAisResponse,
    canSendMessages: changeCanSend,
  }));

  useEffect(() => {
    if (chatSend.images.length === 0) {
      setImageHeight(0);
    } else {
      setImageHeight(stylesheet.attachedImagesView.height);
    }
  }, [chatSend.images.length]);

  return (
    <View style={[stylesheet.container, {height: Math.min(textHeight + imageHeight, maxInputHeight)}]}>
      <ChatAttach
        uniqueId={uniqueId}
        attachmentCount={chatSend.images.length}
        onAttach={(filePath) => {
          changeChatSend(prev => ({
            ...prev,
            images: [
              ...prev.images,
              filePath,
            ]
          }));
        }}
      />

      <View 
        style={stylesheet.textInputContainer} 
      >
        {chatSend.images.length > 0 && 
          (<View 
            style={[stylesheet.attachedImagesView]}
          >{
            chatSend.images.map((v, i) => {
              return <View 
                key={i} 
                style={stylesheet.attachedImageContainer}
              >
                <View style={stylesheet.attachedImageView}>
                  <Image style={stylesheet.attachedImage} source={{uri: v}}/>
                </View>

                <TouchableOpacity 
                  style={stylesheet.attachedImageDeleteButton}
                  onPress={() => {
                    changeChatSend(prev => ({
                      ...prev,
                      images: prev.images.filter((_, index) => index !== i)
                    }));

                    RNFS.unlink(v);
                  }}
                >
                  <Image 
                    style={stylesheet.image} 
                    source={theme.assets.trash}
                  />
                </TouchableOpacity>
              </View>
            })
          }</View>)
        }

        <TextInput
          style={stylesheet.textInput}
          value={localText}
          onChangeText={(t) => {
            if (onChangedText) onChangedText(t);
            changeLocalText(t);

            changeChatSend(prev => ({
              ...prev,
              text: t,
            }));
          }}
          onContentSizeChange={(e) => {
            if (e.nativeEvent.contentSize.height + imageHeight > maxInputHeight) return;
            setTextHeight(Math.max(e.nativeEvent.contentSize.height, stylesheet.container.height));
          }}
          multiline={true}
          placeholderTextColor={theme.textPlaceholderColor}
          placeholder="Click to type a Message to AI"
        />
      </View>

      <ChatSend onPress={() => {
        if (!onSend) return;
        if (!canSend) return;
        if (chatSend.text.trim() === "" && chatSend.images.length === 0) return;
        
        const finalMessage = {
          text: chatSend.text.trim(),
          images: chatSend.images,
        };

        onSend(finalMessage);

        changeLocalText("");
      }}/>
    </View>
  )
})

type ChatAttackProps = {
  uniqueId: string,
  attachmentCount: number,
  onAttach?: (filePath: string) => void,
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
      title: "Attach Image from Gallery",
      onPress: async () => {
        if (!onAttach) return;

        const photos = await launchImageLibrary({
          mediaType: "photo",
          selectionLimit: appSettings.text.attachmentLimit - attachmentCount,
          includeBase64: true,
        });

        if (photos.didCancel || !photos.assets) return;

        for (var i = 0; i < photos.assets.length; i++) {
          const v = photos.assets[i];
          if (!v.uri) continue;
          onAttach(v.uri || "");
        }
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
          params: {id: uniqueId, displayed: "false"},
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
        if (v.displayed === "true") continue;
        if (v.id !== uniqueId) continue;
        if (!v.editedPicturePath) continue;

        v.displayed = "true";

        onAttach(v.editedPicturePath);
        RNFS.unlink(v.picturePath);

        break;
      }
    };

    run();
  }, [imageryProps])

  return (
    <View style={stylesheet.centerContainer}>
      <View style={stylesheet.attachImageView}>
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
            style={stylesheet.image} 
            source={theme.assets.plus}
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
      <View style={stylesheet.sendView}>
        <TouchableOpacity style={stylesheet.sendTouchOpacity} onPress={onPress}>
          <Image style={stylesheet.image} source={theme.assets.rightArrow}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChatInput
