import { cropBoxFileStyle } from '@/assets/styles/screens/imagery/CropBox.style'
import CropBox, { boxState, CropBoxProps } from '@/components/imagery/CropBox'
import InverseMask from '@/components/imagery/InverseMask'
import PhotoOptions from '@/components/imagery/PhotoOptions'
import useTheme, { ColorScheme } from '@/hooks/useTheme'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, LayoutChangeEvent, LayoutRectangle, StyleSheet, View } from 'react-native'

const CropScreen = () => {
  const { picturePath } = useLocalSearchParams<{picturePath: string}>();

  const [layout, setLayout] = useState<LayoutRectangle>();
  const onLayout = (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout);

  const [cropInfo, updateCropInfo] = useState<boxState>();

  const goBack = () => {
    if (router.canGoBack()){
      router.back();
    } else {
      router.replace("..");
    }
  };

  const goForward = () => {
    console.log("next")
  };

  const theme = useTheme();
  const style = createCropScreenStyle(theme);

  return (
    <PhotoOptions
      header='Crop Photo'
      text='Help the AI by cropping the taken photo to help focus on the problem.'
      onPressBack={goBack}
      onPressForward={goForward}
    >
      <View style={style.photoView} onLayout={onLayout}>
        <Image source={{uri: `file://${picturePath}`}} style={style.photo}/>
        
        <InverseMask borderRadius={cropBoxFileStyle.cornerRadius} parentLayout={layout} targetInfo={cropInfo}/>

        <CropBox 
          width={"75%"} 
          height={"75%"} 
          x={"12.5%"} 
          y={"12.5%"} 
          parentLayout={layout} 
          onBoxStateChanged={updateCropInfo}
        />
      </View>
      
    </PhotoOptions>
  )
};
//<InverseMask parentLayout={layout} targetInfo={cropInfo}/>

const createCropScreenStyle = (colors: ColorScheme) => {
  const style = StyleSheet.create({
    photoView: {
      width: "100%", 
      height: 600,
    },

    photo: {
      flex: 1, 
      height: null, 
      width: null, 
      resizeMode: 'contain',
    }
  });

  return style
};

export default CropScreen
