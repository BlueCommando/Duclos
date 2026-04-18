import { createTakePhotoStyle } from '@/assets/styles/screens/TakePhoto.style';
import TakePhoto from '@/components/screens/TakePicture';
import useTheme from '@/hooks/useTheme';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Help with react-native-vision-camera:
// https://react-native-vision-camera.com/docs/api

type TakePhotoProps = {
  
}

const takePhotoChat = ({}: TakePhotoProps) => {
  const onTakePicture = async (path: string) => {
    // go to custom crop screen
  };

  const theme = useTheme();
  const stylesheet = createTakePhotoStyle(theme);
  
  return (
    <SafeAreaView style={stylesheet.safeContainer} edges={['bottom']}>
      <TakePhoto
        onTakePicture={onTakePicture}
      />
    </SafeAreaView>
  )
}

export default takePhotoChat
