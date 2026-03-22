import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import PhotoOptions from '@/components/imagery/PhotoOptions'

const CropScreen = () => {
  const { picturePath } = useLocalSearchParams();

  return (
    <PhotoOptions
      header='Crop Photo'
      text='Help the AI by cropping the taken photo to help focus on the problem.'
    >
        <Text>image to crop</Text>
    </PhotoOptions>
  )
}

export default CropScreen
