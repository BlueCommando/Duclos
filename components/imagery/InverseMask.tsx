import { ColorScheme, darkColors } from "@/hooks/useTheme";
import React, { useEffect } from 'react';
import { LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

// For Cropbox

type targetInfo = {
  x: number,
  y: number,
  width: number,
  height: number,
  inited: boolean,
}

type InverseMaskProps = {
  style?: StyleProp<ViewStyle>,
  borderRadius?: number,
  parentLayout?: LayoutRectangle,
  targetInfo?: targetInfo,
};

const InverseMask = ({ style, borderRadius, parentLayout, targetInfo }: InverseMaskProps) => {
  if (!targetInfo || !parentLayout) return <View/>;

  const stylesheet = createExampleStyle(darkColors);

  return (
    <View style={stylesheet.container}>

      {/*Left*/}
      <View style={[
        stylesheet.defaultBoxStyle, 
        style,
        {
          width: targetInfo.x,
          height: "100%",
          top: 0,
          left: 0,
        },
      ]}/>

      {/*Right*/}
      <View style={[
        stylesheet.defaultBoxStyle, 
        style,
        {
          width: parentLayout.width - targetInfo.width - targetInfo.x,
          height: "100%",
          top: 0,
          left: targetInfo.width + targetInfo.x,
        },
      ]}/>

      {/*Top*/}
      <View style={[
        stylesheet.defaultBoxStyle, 
        style,
        {
          width: targetInfo.width,
          height: targetInfo.y,
          top: 0,
          left: targetInfo.x,
        },
      ]}/>

      {/*Bottom*/}
      <View style={[
        stylesheet.defaultBoxStyle, 
        style,
        {
          width: targetInfo.width,
          height: parentLayout.height - targetInfo.height - targetInfo.y,
          top: targetInfo.height + targetInfo.y,
          left: targetInfo.x,
        },
      ]}/>

      {(borderRadius && borderRadius > 0) && (
        <>

          {/*Top Left Corner*/}
          <View style={[
            stylesheet.container,
            stylesheet.cornerRadiusContainer,
            {
              width: borderRadius,
              height: borderRadius,
              borderBottomRightRadius: "75%",
              top: targetInfo.y - borderRadius / 2,
              left: targetInfo.x - borderRadius / 2,
            }
          ]}>
            <View
              style={[
                stylesheet.defaultBoxStyle,
                style,
                {
                  width: borderRadius / 2,
                  height: borderRadius / 2,
                  right: 0,
                  bottom: 0,
                },
              ]}
            />
          </View>

          {/*Bottom Left Corner*/}
          <View style={[
            stylesheet.container,
            stylesheet.cornerRadiusContainer,
            {
              width: borderRadius,
              height: borderRadius,
              borderTopRightRadius: "75%",
              top: targetInfo.y - borderRadius / 2 + targetInfo.height,
              left: targetInfo.x - borderRadius / 2,
            }
          ]}>
            <View
              style={[
                stylesheet.defaultBoxStyle,
                style,
                {
                  width: borderRadius / 2,
                  height: borderRadius / 2,
                  top: 0,
                  right: 0,
                },
              ]}
            />
          </View>
            
          {/*Top Right Corner*/}
          <View style={[
            stylesheet.container,
            stylesheet.cornerRadiusContainer,
            {
              width: borderRadius,
              height: borderRadius,
              borderBottomLeftRadius: "75%",
              top: targetInfo.y - borderRadius / 2,
              left: targetInfo.x - borderRadius / 2 + targetInfo.width,
            }
          ]}>
            <View
              style={[
                stylesheet.defaultBoxStyle,
                style,
                {
                  width: borderRadius / 2,
                  height: borderRadius / 2,
                  bottom: 0,
                  left: 0,
                },
              ]}
            />
          </View>

          {/*Bottom Right Corner*/}
          <View style={[
            stylesheet.container,
            stylesheet.cornerRadiusContainer,
            {
              width: borderRadius,
              height: borderRadius,
              borderTopLeftRadius: "75%",
              top: targetInfo.y - borderRadius / 2 + targetInfo.height,
              left: targetInfo.x - borderRadius / 2 + targetInfo.width,
            }
          ]}>
            <View
              style={[
                stylesheet.defaultBoxStyle,
                style,
                {
                  width: borderRadius / 2,
                  height: borderRadius / 2,
                  top: 0,
                  left: 0,
                },
              ]}
            />
          </View>
        </>
      )}
    </View>
  )
}

export const createExampleStyle = (colors: ColorScheme) => {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
      },

      cornerRadiusContainer: {
        backgroundColor: "transparent",
        overflow: "hidden",
      },
      
      defaultBoxStyle: {
        flex: 1,
        position: "absolute",
        backgroundColor: colors.border,
        opacity: 0.75,
      },

      test: {
        flex: 1,
        position: "absolute",
        backgroundColor: "#ff0000",
        opacity: 0.75,
      }
    });

    return styles;
}

export default InverseMask
