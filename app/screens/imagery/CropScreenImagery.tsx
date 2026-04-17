import { imageryLocalParams } from '@/assets/styles/imagery/ImageryLocalParam';
import CropScreen from '@/components/screens/CropScreen';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

const CropScreenImagery = () => {
  const params = useLocalSearchParams<imageryLocalParams>();

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

      onForwardPressed={(params) => {
        router.push({
          pathname: "./PrepromptScreen",
          params: params,
        });
      }}
    />
  )
};

export default CropScreenImagery
