import { cropBoxFileStyle } from '@/assets/styles/screens/imagery/CropBox.style'
import CropBox, { boxState } from '@/components/imagery/CropBox'
import InverseMask from '@/components/imagery/InverseMask'
import PhotoOptions from '@/components/imagery/PhotoOptions'
import useTheme, { ColorScheme } from '@/hooks/useTheme'
import { useImageManipulator } from 'expo-image-manipulator'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, LayoutChangeEvent, LayoutRectangle, StyleSheet, View } from 'react-native'

// Help with expo-image-manipulator:
// https://docs.expo.dev/versions/latest/sdk/imagemanipulator/

type localParams = {
  picturePath: string,
  dWidth?: string,
  dHeight?: string,
  dX?: string,
  dY?: string,
};

const CropScreen = () => {
  const params = useLocalSearchParams<localParams>();
  const { picturePath, dWidth, dHeight, dX, dY } = params;

  const [layout, setLayout] = useState<LayoutRectangle>();
  const onLayout = (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout);

  const [cropInfo, updateCropInfo] = useState<boxState>();

  const context = useImageManipulator(picturePath);

  const goBack = () => {
    if (router.canGoBack()){
      router.back();
    } else {
      router.replace("..");
    }
  };

  const goForward = async () => {
    if (!layout){
      throw new Error(`layout is an unknown value (${layout})`)
    }
    if (!cropInfo){
      throw new Error(`cropInfo is an unknown value (${cropInfo})`)
    }

    const { width, height } = await Image.getSize(picturePath);

    const widthScalar = width / layout.width;
    const heightScalar = height / layout.height;

    context.crop({
      width: cropInfo.width * widthScalar,
      height: cropInfo.height * heightScalar,
      originX: cropInfo.x * widthScalar,
      originY: cropInfo.y * heightScalar,
    });

    const render = await context.renderAsync();
    const result = await render.saveAsync();
    
    router.push({
      pathname: "./PrepromptScreen",
      params: {
        ...params,
        dWidth: cropInfo.width,
        dHeight: cropInfo.height,
        dX: cropInfo.x,
        dY: cropInfo.y,
        picturePath: picturePath,
        editedPicturePath: result.uri,
      }
    });
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
      <View style={style.container} onLayout={onLayout}>
        <Image source={{uri: picturePath}} style={style.photo}/>
        
        <InverseMask borderRadius={cropBoxFileStyle.cornerRadius} parentLayout={layout} targetInfo={cropInfo}/>

        <CropBox 
          width={dWidth && parseFloat(dWidth) || "75%"} 
          height={dHeight && parseFloat(dHeight) || "75%"} 
          x={dX && parseFloat(dX) || "12.5%"} 
          y={dY && parseFloat(dY) ||"12.5%"} 
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
    container: {
      flex: 1,
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
