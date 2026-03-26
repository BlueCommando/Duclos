import { createCropBoxStyle, cropBoxFileStyle } from '@/assets/styles/screens/imagery/CropBox.style';
import useTheme from '@/hooks/useTheme';
import React, { useState } from 'react';
import { LayoutRectangle, PanResponder, View } from 'react-native';

const cornerRadius = cropBoxFileStyle.cornerRadius;

const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

type boxState = {
  x: number,
  y: number,
  rx: number,
  ry: number,
  px: number,
  py: number,
  width: number,
  height: number,
  tlc: boolean,
  blc: boolean,
  trc: boolean,
  brc: boolean,
}

type CropBoxProps = {
  parentLayout?: LayoutRectangle,
}

const CropBox = ({ parentLayout }: CropBoxProps) => {
  const [boxState, updateBoxState] = useState<boxState>({
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    px: 0,
    py: 0,
    width: 100,
    height: 100,
    tlc: false,
    blc: false,
    trc: false,
    brc: false,
  });

  const updateBoxStateClamped = (update: boxState | ((prev: boxState) => boxState)) => {
    if (!parentLayout){
      throw new Error("Cropbox has no Parent Layout")
    }

    updateBoxState(prev => {
      const next = typeof update === "function" ? update(prev) : update;

      console.log(next.y, parentLayout.height - next.height)

      return {
        ...next,
        width: clamp(next.width, cornerRadius * 2, parentLayout.width),
        height: clamp(next.height, cornerRadius * 2, parentLayout.height - next.y),
        x: clamp(next.x, 0, parentLayout.width - next.width),
        y: clamp(next.y, 0, parentLayout.height + next.height),
      };
    });
  };

  const dragBox = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX, locationY, pageX, pageY, } = event.nativeEvent;

      const xDiff = boxState.width - locationX;
      const yDiff = boxState.height - locationY;

      updateBoxState(prev => ({
        ...prev,
        rx: locationX,
        ry: locationY,
        px: pageX,
        py: pageY,
        tlc: locationX < cornerRadius && locationY < cornerRadius,
        blc: locationX < cornerRadius && yDiff < cornerRadius,
        trc: xDiff < cornerRadius && locationY < cornerRadius,
        brc: xDiff < cornerRadius && yDiff < cornerRadius,
      }));
    },

    onPanResponderMove: (event, gesture) => {
      const { locationX, locationY, pageX, pageY, } = event.nativeEvent;

      // Top left corner
      if (boxState.tlc){

        updateBoxStateClamped(prev => ({
            ...prev,
            width: prev.width - gesture.dx,
            height: prev.height - gesture.dy,
            x: prev.x + gesture.dx,
            y: prev.y + gesture.dy,
        }));
      
      // Bottom left corner
      } else if (boxState.blc){

        updateBoxStateClamped(prev => ({
          ...prev,
          width: prev.width - gesture.dx,
          height: prev.height + gesture.dy,
          x: prev.x + gesture.dx,
        }));

      // Top right corner
      } else if (boxState.trc){

        updateBoxStateClamped(prev => ({
          ...prev,
          width: prev.width + gesture.dx,
          height: prev.height - gesture.dy,
          y: prev.y + gesture.dy,
        }));

      // Bottom right corner
      } else if (boxState.brc){

        updateBoxStateClamped(prev => ({
          ...prev,
          width: prev.width + gesture.dx,
          height: prev.height + gesture.dy,
          //x: prev.x + gesture.dx,
        }));
      
      // Dragging
      } else {

        updateBoxStateClamped(prev => ({
          ...prev,
          x: boxState.x + gesture.dx,
          y: boxState.y + gesture.dy,
        }));

      }

      updateBoxState(prev => ({
        ...prev,
        rx: locationX,
        ry: locationY,
        px: pageX,
        py: pageY,
      }));
    },
  });

  let theme = useTheme();

  if (theme.statusBarStyle != "light-content"){
    theme = theme.opposite;
  }

  const style = createCropBoxStyle(theme);

  return (
    <View style={
      [
        style.cropBox, 
        {
          width: boxState.width,
          height: boxState.height,
          left: boxState.x, 
          top: boxState.y,
        },
      ]
      } 

      {...dragBox.panHandlers}
    >
      <View style={style.topLeftCornerContainer} pointerEvents="none">
        <View style={[style.cropTopLeftCorner, style.globalCorner]}/>
      </View>

      <View style={style.bottomLeftCornerContainer} pointerEvents="none">
        <View style={[style.cropBottomLeftCorner, style.globalCorner]}/>
      </View>

      <View style={style.topRightCornerContainer} pointerEvents="none">
        <View style={[style.cropTopRightCorner, style.globalCorner]}/>
      </View>

      <View style={style.bottomRightCornerContainer} pointerEvents="none">
        <View style={[style.cropBottomRightCorner, style.globalCorner]}/>
      </View>

    </View>
  )
};

export default CropBox