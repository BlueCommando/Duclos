import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native'
import { EasingFunction } from 'react-native-reanimated'

// get the box images from school

type IntroTextProps = {
    text: string,
    letterSpacing: number,
    duration: number,
    xPosOffset?: number,
    yPosOffset?: number,
}

const IntroText = ({ text, duration, letterSpacing, xPosOffset, yPosOffset }: IntroTextProps) => {
  // Scaling
  const size = useRef( new Animated.Value(0) ).current;

  useEffect(() => {
    Animated.timing(size, {
      toValue: 1,
      duration: duration,
      easing: easeInCubic,
      useNativeDriver: false,
    }).start()
  }, [size])

  // Position
  const { height, width } = Dimensions.get('window');
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  
  const position = useRef( new Animated.ValueXY({ x: 0, y: 0 }) ).current;

  const [hasSize, changeHasSize] = useState(false)

  useEffect(() => {
    if (textSize.width === 0 || textSize.height === 0) return;

    const startX = width / 2 - textSize.width / 2;
    const startY = height / 2 - textSize.height / 2;
    
    if (!hasSize){
      changeHasSize(true);
      position.setValue({ x: startX, y: startY });

      const x = startX + (xPosOffset ?? 0);
      const y = startY + (yPosOffset ?? 0);

      Animated.timing(position, {
        toValue: {x, y},
        duration: duration,
        easing: easeInCubic,
        useNativeDriver: false,
      }).start()
    }
  }, [position, textSize]);

  return (
    <Animated.View style={[position.getLayout()]}>
      <Animated.Text 
        style={
          [
            style.text, 
            {
              letterSpacing: letterSpacing,
              transform: [{ scale: size }]
            }
          ]
        }
        
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout; 
          setTextSize({ width, height });
        }}
        >
      {text}</Animated.Text>
    </Animated.View>
  )
}

const style = StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    text: {
      fontSize: 40,
      textAlign: 'center',
      fontFamily: 'Michroma',
    }
})

// From: https://easings.net/#easeInCubic
const easeInCubic: EasingFunction = (value) => {
  return Math.pow(value, 3)
}

// From: https://easings.net/#easeOutCubic
const easeOutCubic: EasingFunction = (value) => {
  return 1 - Math.pow(1 - value, 3)
}

export default IntroText