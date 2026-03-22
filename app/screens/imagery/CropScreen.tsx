import PhotoOptions from '@/components/imagery/PhotoOptions'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const CropScreen = () => {
  const { picturePath } = useLocalSearchParams();

  const goBack = () => {
    if (router.canGoBack()){
      router.back()
    } else {
      router.replace("..")
    }
  }

  const goForward = () => {
    console.log("next")
  }

  return (
    <PhotoOptions
      header='Crop Photo'
      text='Help the AI by cropping the taken photo to help focus on the problem.'
      onPressBack={goBack}
      onPressForward={goForward}
    >
      <View>
        <Text>image to crop</Text>
        <View style={{width: "100%", height: "50%", backgroundColor: "#000"}}></View>
      </View>
    </PhotoOptions>
  )
}

export default CropScreen
