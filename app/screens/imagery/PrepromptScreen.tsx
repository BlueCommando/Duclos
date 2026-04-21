import { createPromptScreenStyle } from '@/assets/styles/imagery/PrepromptScreen.style';
import PhotoOptions from '@/components/imagery/PhotoOptions';
import useTheme from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';

const PrepromptScreen = () => {
  const params = useLocalSearchParams<imageryLocalParams>();

  const [text, changeText] = useState(params.prompt || "");

  const goBack = () => {
    if (router.canGoBack()){
      router.dismiss(1);
      router.replace({
        pathname: "./CropScreen",
        params: {
          ...params,
          prompt: text,
        },
      });
    } else {
      router.replace("..");
    }
  };

  const goForward = () => {
    const genParams = {
      ...params,
      prompt: text.trim() || undefined,
    };
    
    if (genParams.prompt === "") genParams.prompt = undefined;

    router.dismissAll();
    router.replace({
      pathname: "./LoadingResponseScreen",
      params: genParams,
    });
  };

  const theme = useTheme();
  const stylesheet = createPromptScreenStyle(theme);

  return (
    <PhotoOptions
      header='Pre-prompt Message'
      text="Tell what the AI what to do with the image. It's already pre-prompted to solve problems. You can input nothing."
      onPressBack={goBack}
      onPressForward={goForward}
    >
      <TextInput 
        style={stylesheet.textInput}
        value={text}
        onChangeText={changeText}
        multiline={true}
        placeholder="Click to type a Message to AI"
        placeholderTextColor={theme.opposite.textPlaceholderColor}
        textAlign='left'
        textAlignVertical='top'
      ></TextInput>
    </PhotoOptions>
  )
};

export default PrepromptScreen
