import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import PhotoOptions from '@/components/imagery/PhotoOptions'

const CropScreen = () => {
  const { picturePath } = useLocalSearchParams();

  return (
    <PhotoOptions>
        <Text>sup bro</Text>
    </PhotoOptions>
  )
}

export default CropScreen
