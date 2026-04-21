import { createTakePhotoStyle } from '@/assets/styles/screens/TakePhoto.style';
import TakePhoto from '@/components/screens/TakePicture';
import useTheme from '@/hooks/useTheme';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Help with react-native-vision-camera:
// https://react-native-vision-camera.com/docs/api

const takePhotoChat = () => {
  const params = useLocalSearchParams<{id: string}>();

  const onTakePicture = async (path: string) => {
    router.push({
      pathname: "/screens/CropScreenChat",
      params: {...params, picturePath: path},
    });
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
