import { View, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import React from 'react'
import Draggable from 'react-native-draggable'
import useTheme, { ColorScheme } from '@/hooks/useTheme';

// Help with react-native-draggable:
// https://github.com/tongyy/react-native-draggable/blob/master/README.md

const SHUT_THE_HELL_UP = () => {}

const CropBox = () => {
  let theme = useTheme();

  if (theme.statusBarStyle != "light-content"){
    theme = theme.opposite;
  }

  const style = createCropBoxStyle(theme);

  return (
    <DraggableCorner style={style.cropBox}>
      <DraggableCorner style={style.cropTopLeftCorner} posX={-5} posY={-5}></DraggableCorner>
    </DraggableCorner>
  )
};


// repeat the corners for everything
const createCropBoxStyle = (colors: ColorScheme) => {
  const style = StyleSheet.create({
    cropBox: {
      width: 100,
      height: 100,
      opacity: 0.75,
      borderWidth: 5,
      borderRadius: 25,
      borderColor: colors.border,
    },

    cropTopLeftCorner: {
      width: 50,
      height: 50,
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

type DraggableCornerProps = {
  posX?: number,
  posY?: number,
  style?: StyleProp<ViewStyle>,
  children?: React.ReactNode,
}

const DraggableCorner = ( { posX, posY, style, children }: DraggableCornerProps ) => {
  return (
    <Draggable 
        x={posX || 0} 
        y={posY || 0}
        touchableOpacityProps={{ activeOpacity: 1 }}

        onDrag={SHUT_THE_HELL_UP}
        onShortPressRelease={SHUT_THE_HELL_UP}
        onDragRelease={SHUT_THE_HELL_UP}
        onLongPress={SHUT_THE_HELL_UP}
        onPressIn={SHUT_THE_HELL_UP}
        onPressOut={SHUT_THE_HELL_UP}
        onRelease={SHUT_THE_HELL_UP}
    >
      <View style={style}>{children}</View>
    </Draggable>
  )
};

export default CropBox