import { createLoadingResponseScreenStyle } from '@/assets/styles/imagery/LoadingResponseScreen.style';
import AiService from '@/components/ai/AiService';
import useTheme from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, Text, View } from 'react-native';
import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';

const loadingTextInitState = "GENERATING.";

const getUnixTime = () => Date.now() / 1000;

const LoadingMessage = () => {
  const params = useLocalSearchParams<imageryLocalParams>();
  const { editedPicturePath, prompt } = params;

  const [loadingText, changeLoadingText] = useState(loadingTextInitState);
  
  if (!editedPicturePath){
    throw new Error(`'editedPicturePath' is at an unknown value (${editedPicturePath})`);
  }

  // Functionality
  const generateResponse = async () => {
    const startTime = getUnixTime();

    const pictureBase64 = await AiService.imageToBase64(editedPicturePath);

    const response = await AiService.imageCompletion({
      messages: [
        {
          role: "user",
          content: [
            ...(
              prompt ? [{
                type: "text",
                text: prompt,
              }] : []
            ),

            {
              type: "image_url",
              image_url: {
                url: pictureBase64,
              },
            },
          ],
        }
      ],
    });

    router.replace({
      pathname: "./TempChat",
      params: {
        ...params,
        aiResponse: response.text,
        aiResponseTimeUnix: getUnixTime() - startTime,
      },
    })
  };

  useEffect(() => {generateResponse();}, []);

  // Text
  useEffect(() => {
    setTimeout(() => {
      changeLoadingText(prev => {
        const amount = prev.split(".").length - 1;
        if (amount >= 3) return loadingTextInitState;
        return prev + ".";
      })
    }, 1000);
  }, [loadingText]);

  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        easing: (n) => n, // make easing linear
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const theme = useTheme();
  const stylesheet = createLoadingResponseScreenStyle(theme);

  return (
    <LinearGradient style={stylesheet.container} colors={theme.gradients.background}>
      <View style={stylesheet.centerView}>

        <View style={stylesheet.infoContainer}>
          <View style={stylesheet.edgeContainer}>
            <Text style={stylesheet.headerText}>Image:</Text>
            <Image source={{uri: editedPicturePath}} style={[stylesheet.photo, stylesheet.fitImage]}/>
          </View>
        </View>

        <View style={stylesheet.infoContainer}>
          <View style={stylesheet.edgeContainer}>
            <Text style={stylesheet.headerText}>Prompted Message:</Text>
            <ScrollView style={stylesheet.scrollView}>
              <Text style={stylesheet.text}>{prompt || "[NOTHING]"}</Text>
            </ScrollView>
          </View>
        </View>

      </View>

      <View style={stylesheet.centerView}>
        <View style={stylesheet.loadingScreenView}>
          <View style={stylesheet.container}>
            <Animated.Image 
              source={theme.assets.loadingCirclePath} 
              style={[
                stylesheet.fitImage, 
                {
                  transform: [
                    {rotate: rotate}
                  ],
                },
              ]}
            />
          </View>
          
          <Text style={stylesheet.loadingText}>{loadingText}</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default LoadingMessage