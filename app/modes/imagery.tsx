import { createImageryStyle } from '@/assets/styles/modes/imagery.style'
import CameraView from '@/components/imagery/CameraView'
import useTheme from '@/hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Camera } from 'react-native-vision-camera'

// TODO:
//
// Display camera ✅
// Get picture from user camera ❌
// allow user to crop image ❌
// tell user if they want to pre-input a message for the image ❌
// try react-native-markdown-display for the ai... ❌
//

// Help with react-native-vision-camera:
// https://react-native-vision-camera.com/docs/api

const imagery = () => {
  const camera = useRef<Camera | null>(null)

  const takePicture = async () => {
    
  };

  const theme = useTheme();
  const style = createImageryStyle(theme);

  return (
    <LinearGradient style={style.container} colors={theme.gradients.background}>
      <CameraView camera={camera}/>

      <View style={style.bottomCenterView}>
        <View style={style.pictureBar}>

          <View style={style.pictureButtonBorder1}>
            <View style={style.pictureButtonBorder2}>
              <TouchableOpacity onPress={takePicture} style={style.pictureButton}/>
            </View>
          </View>

        </View>
      </View>
    </LinearGradient>
  )
}

export default imagery