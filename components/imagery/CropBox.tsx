import appSettings from '@/assets/appSettings';
import useTheme, { ColorScheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import { PanResponder, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// Help with react-native-draggable:
// https://github.com/tongyy/react-native-draggable/blob/master/README.md

const cornerRadius = appSettings.imagery.crop.cornerRadius

const CropBox = () => {
  const [boxState, updateBoxState] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const dragBox = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      const { locationX, locationY } = event.nativeEvent;

      const xDiff = locationX - boxState.width;
      const yDiff = locationY - boxState.height;

      // Top left Corner
      if (locationX < cornerRadius && locationY < cornerRadius){

        console.log("top left corner");

      // Bottom Left Corner
      } else if (locationX < cornerRadius && yDiff < cornerRadius){

        console.log("bottom left corner");

      // Top Right Corner
      } else if (xDiff < cornerRadius && locationY < cornerRadius){

        console.log("top right corner");

      // Bottom Right Corner
      } else if (xDiff < cornerRadius && yDiff < cornerRadius){

        console.log("bottom right corner");

      // Drag Box
      } else {
        updateBoxState(prev => ({
          ...prev,
          mX: boxState.x + gesture.dx,
          mY: boxState.y + gesture.dy,
        }));
      }
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
    />
  )
};


// repeat the corners for everything
const createCropBoxStyle = (colors: ColorScheme) => {
  const style = StyleSheet.create({
    cropBox: {
      opacity: 0.75,
      borderWidth: 5,
      borderRadius: 25,
      borderColor: colors.border,
    },

    cropTopLeftCorner: {
      width: 50,
      height: 50,
      right: 5,
      bottom: 5,
      borderTopWidth: 5,
      borderLeftWidth: 5,
      borderTopLeftRadius: 25,
      borderColor: "#ffffff"
    },

    placeholder: {
      width: 100,
      height: 100,
      backgroundColor: "#000",
    }
  })

  return style;
}

export default CropBox