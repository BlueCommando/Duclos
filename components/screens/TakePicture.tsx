import { createTakePhotoStyle } from '@/assets/styles/screens/TakePhoto.style';
import CameraView from '@/components/imagery/CameraView';
import useTheme from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';

// Help with react-native-vision-camera:
// https://react-native-vision-camera.com/docs/api

type TakePhotoProps = {
  camRef?: React.RefObject<Camera | null>,
  onTakePicture?: (picturePath: string) => void,
}

const TakePhoto = ({camRef, onTakePicture}: TakePhotoProps) => {
  camRef = camRef || useRef<Camera | null>(null)

  const takePicture = async () => {
    if (!onTakePicture) return;

    const picture = await camRef.current?.takePhoto({ enableShutterSound: true, });
    onTakePicture(`file://${picture?.path}`);
  };

  const theme = useTheme();
  const stylesheet = createTakePhotoStyle(theme);
  
  return (
    <LinearGradient style={stylesheet.container} colors={theme.gradients.background}>
      <CameraView camera={camRef}/>

      <View style={stylesheet.bottomCenterView}>
        <View style={stylesheet.pictureBar}>

          <View style={[stylesheet.pictureButtonBorder, {backgroundColor: theme.opposite.border}]}>
            <View style={[stylesheet.pictureButtonBorder, {backgroundColor: theme.border}]}>
              <TouchableOpacity onPress={takePicture} style={stylesheet.pictureButton}/>
            </View>
          </View>

        </View>
      </View>
    </LinearGradient>
  )
}

export default TakePhoto
