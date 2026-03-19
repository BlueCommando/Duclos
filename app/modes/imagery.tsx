import { createImageryStyle } from '@/assets/styles/modes/imagery.style'
import useTheme from '@/hooks/useTheme'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

// TODO:
//
// Get picture from user camera ❌
// allow user to crop image ❌
// tell user if they want to pre-input a message for the image ❌
// try react-native-markdown-display for the ai... ❌
//

// Help with react-native-image-picker:
// https://github.com/react-native-image-picker/react-native-image-picker/blob/main/README.md

const imagery = () => {
  const theme = useTheme();
  const style = createImageryStyle(theme);

  return (
    <LinearGradient style={style.container} colors={theme.gradients.background}>
      <View style={style.bottomCenterView}>
        <View style={style.pictureBar}>

          <View style={style.pictureButtonBorder1}>
            <View style={style.pictureButtonBorder2}>
              <TouchableOpacity style={style.pictureButton}/>
            </View>
          </View>

        </View>
      </View>
    </LinearGradient>
  )
}

export default imagery