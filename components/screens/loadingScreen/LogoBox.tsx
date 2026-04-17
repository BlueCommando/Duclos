import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import { EasingFunction } from 'react-native-reanimated';

type LogoBoxProps = {
  source?: any,
  scale: number,
  /**In degrees*/
  finalRotation?: number,
  /**In milliseconds*/
  duration: number,
  xPosOffset?: number,
  yPosOffset?: number,
}

const LogoBox = ({ source, scale, finalRotation, duration, xPosOffset, yPosOffset }: LogoBoxProps) => {
  // Size
  const sizeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(sizeAnim, {
      toValue: scale,
      duration: duration,
      easing: Easing.cubic,
      useNativeDriver: false,
    }).start();
  }, [sizeAnim]);

  // Position
  const { height, width } = Dimensions.get('window');

  const position = useRef( new Animated.ValueXY({ x: width / 2, y: height / 2 }) ).current;

  useEffect(() => {
    const x = width / 2 + (xPosOffset ?? 0)
    const y = height / 2  + (yPosOffset ?? 0)

    Animated.timing(position, {
      toValue: {x, y},
      duration: duration / 1.2,
      easing: easeInCubic,
      useNativeDriver: false,
    }).start()
  }, [position]);

  // Rotation
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const [rotationRange, setRotationRange] = useState([`${ Math.random() * 25 }deg`, "360deg"]);
  const [endOfRotation, changeEndOfRotation] = useState(false);

  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: 1,
      duration: duration,
      easing: endOfRotation ? easeOutCubic : easeInCubic,
      useNativeDriver: false,
    }).start(() => {
      if (endOfRotation) return
      changeEndOfRotation(true)
      setRotationRange(["360deg", `${ 720 + (finalRotation ?? 0) }deg`])
      rotationAnim.setValue(0)
    });
  });

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: rotationRange,
  });

  // Main
  return (
    <Animated.Image
      style={{
        width: 1, 
        height: 1,
        position: "absolute",
        transform: [
          {translateX: position.x,},
          {translateY: position.y,},
          {scale: sizeAnim},
          {rotate: rotate,},
      ],
      }}
      source={source}
    ></Animated.Image>
  )
}

// From: https://easings.net/#easeInCubic
const easeInCubic: EasingFunction = (value) => {
  return Math.pow(value, 3)
}

// From: https://easings.net/#easeOutCubic
const easeOutCubic: EasingFunction = (value) => {
  return 1 - Math.pow(1 - value, 3)
}

export default LogoBox
