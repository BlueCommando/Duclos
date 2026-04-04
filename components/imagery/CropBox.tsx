import { createCropBoxStyle, cropBoxFileStyle } from '@/assets/styles/components/imagery/CropBox.style';
import { lightColors } from '@/hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { LayoutRectangle, PanResponder, View } from 'react-native';

const cornerRadius = cropBoxFileStyle.cornerRadius;

/**
 * Converts a Percentage to a alpha number, for example: 
 * 
 * **(percToNum('50%') === 0.5)**
 * */
const percToNum = (n: string): number => parseFloat(n.slice(0, -1)) / 100;
const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

type customSetState = (update: boxState | ((prev: boxState) => boxState)) => void

export type boxState = {
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
  inited: boolean,
}

export type CropBoxProps = {
  width?: number | string,
  height?: number | string,
  x?: number | string,
  y?: number | string,
  parentLayout?: LayoutRectangle,
  onBoxStateChanged?: (event: boxState) => void,
}

const CropBox = ({ width, height, x, y, parentLayout, onBoxStateChanged }: CropBoxProps) => {
  const [boxState, updateBoxState] = useState<boxState>({
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    px: 0,
    py: 0,
    width: 0,
    height: 0,
    tlc: false,
    blc: false,
    trc: false,
    brc: false,
    inited: false,
  });

  useEffect(() => {
    if (!boxState.inited) return;
    onBoxStateChanged?.(boxState);
  }, [boxState]);

  // Will go into action when mounted.
  useEffect(() => {
    if (!parentLayout) return;

    const w = parentLayout.width;
    const h = parentLayout.height;

    updateBoxState(prev => ({
      ...prev,
      width: typeof width === "string" && percToNum(width) * w || typeof width === "number" && width || cornerRadius * 2,
      height: typeof height === "string" && percToNum(height) * h || typeof height === "number" && height || cornerRadius * 2,
      x: typeof x === "string" && percToNum(x) * w || typeof x === "number" && x || 0,
      y: typeof y === "string" && percToNum(y) * h || typeof y === "number" && y || 0,
      inited: true,
    }));
  }, [parentLayout]);

  const updateBoxStateClamped: customSetState = (update) => {
    if (!parentLayout){
      throw new Error("Cropbox has no Parent Layout")
    }

    updateBoxState(prev => {
      const next = typeof update === "function" ? update(prev) : update;

      if (!next.tlc && !next.blc && !next.trc && !next.brc){

        return {
          ...next,
          x: clamp(next.x, 0, parentLayout.width - next.width),
          y: clamp(next.y, 0, parentLayout.height - next.height),
        };

      } else {

        const width = clamp(next.width, cornerRadius * 2, parentLayout.width);
        const height = clamp(next.height, cornerRadius * 2, parentLayout.height - next.y);

        return {
          ...next,
          width: width,
          height: height,
          x: width > cornerRadius * 2 ? clamp(next.x, 0, parentLayout.width - next.width) : prev.x,
          y: height > cornerRadius * 2 ? clamp(next.y, 0, parentLayout.height + next.height) : prev.y,
        };

      }
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

  const stylesheet = createCropBoxStyle(lightColors);

  return (
    <View style={
      [
        stylesheet.cropBox, 
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
      
      <View style={stylesheet.topLeftCornerContainer} pointerEvents="none">
        <View style={[stylesheet.cropTopLeftCorner, stylesheet.globalCorner]}/>
      </View>

      <View style={stylesheet.bottomLeftCornerContainer} pointerEvents="none">
        <View style={[stylesheet.cropBottomLeftCorner, stylesheet.globalCorner]}/>
      </View>

      <View style={stylesheet.topRightCornerContainer} pointerEvents="none">
        <View style={[stylesheet.cropTopRightCorner, stylesheet.globalCorner]}/>
      </View>

      <View style={stylesheet.bottomRightCornerContainer} pointerEvents="none">
        <View style={[stylesheet.cropBottomRightCorner, stylesheet.globalCorner]}/>
      </View>

    </View>
  )
};

export default CropBox