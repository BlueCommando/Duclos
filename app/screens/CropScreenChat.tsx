import { chatInputImageryParams, useImageryStore } from '@/components/app/ChatInput';
import CropScreen from '@/components/screens/CropScreen';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

const CropScreenImagery = () => {
  const params = useLocalSearchParams<chatInputImageryParams>();

  return (
    <CropScreen
      params={params}

      onBackPressed={() => {
        if (router.canGoBack()){
          router.back();
        } else {
          router.replace("..");
        }
      }}

      onForwardPressed={(editedParams) => {
        useImageryStore.getState().addImagery({...params, ...editedParams});
        router.dismiss(2);
      }}
    />
  )
};

export default CropScreenImagery
