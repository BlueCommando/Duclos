import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';
import { cropBoxFileStyle } from '@/assets/styles/screens/CropScreen/CropBox.style';
import { createCropScreenStyle } from '@/assets/styles/screens/CropScreen/index.style';
import useTheme from '@/hooks/useTheme';
import { useImageManipulator } from 'expo-image-manipulator';
import React, { useState } from 'react';
import { Image, LayoutChangeEvent, LayoutRectangle, View } from 'react-native';
import PhotoOptions from '../../imagery/PhotoOptions';
import CropBox, { boxState } from './CropBox';
import InverseMask from './InverseMask';

// Help with expo-image-manipulator:
// https://docs.expo.dev/versions/latest/sdk/imagemanipulator/

type CropScreenProps = {
  params: imageryLocalParams,
  onBackPressed?: (curParams: imageryLocalParams) => void,
  onForwardPressed?: (curParams: imageryLocalParams) => void,
};

const CropScreen = ({params, onBackPressed, onForwardPressed}: CropScreenProps) => {
  const { picturePath, dWidth, dHeight, dX, dY } = params;

  const [layout, setLayout] = useState<LayoutRectangle>();
  const onLayout = (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout);

  const [cropInfo, updateCropInfo] = useState<boxState>();

  const context = useImageManipulator(picturePath);

  const onBack = () => {
    if (!onBackPressed) return;
    onBackPressed(params);
  };

  const goForward = async () => {
    if (!onForwardPressed) return;
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
      width: Math.min(cropInfo.width * widthScalar, width),
      height: Math.min(cropInfo.height * heightScalar, height),
      originX: Math.min(cropInfo.x * widthScalar, cropInfo.width * widthScalar),
      originY: Math.min(cropInfo.y * heightScalar, cropInfo.height * heightScalar),
    });

    const render = await context.renderAsync();
    const result = await render.saveAsync();

    onForwardPressed({
      ...params,
      picturePath: picturePath,
      editedPicturePath: result.uri,
    });
  };

  const theme = useTheme();
  const style = createCropScreenStyle(theme);

  return (
    <PhotoOptions
      header='Crop Photo'
      text='Help the AI by cropping the taken photo to help focus on the problem.'
      onPressBack={onBack}
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

export default CropScreen
