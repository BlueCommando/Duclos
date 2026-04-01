import { View, Text, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const PrepromptScreen = () => {
  const { editedPicturePath } = useLocalSearchParams<{editedPicturePath: string, picturePath: string}>();

  return (
    <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
        <Image source={{uri: editedPicturePath}} style={{width: "50%", height: "50%"}}/>
    </View>
  )
}

export default PrepromptScreen
