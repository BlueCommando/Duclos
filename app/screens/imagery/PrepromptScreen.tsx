import PhotoOptions from '@/components/imagery/PhotoOptions';
import useTheme, { ColorScheme } from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

const PrepromptScreen = () => {
  const params = useLocalSearchParams<{prompt?: string}>();

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
    console.log(genParams.prompt)

    if (!!true) return // del this later
    router.push({
      pathname: "./PrepromptScreen",
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

const createPromptScreenStyle = (colors: ColorScheme) => {
  const stylesheet = StyleSheet.create({
    container: {
      flex: 1
    },

    textInput: {
      flex: 1,
      flexDirection: "row",
      fontSize: 20,
      color: colors.opposite.textColor,
      margin: 10,
    },
  });

  return stylesheet
};

export default PrepromptScreen
