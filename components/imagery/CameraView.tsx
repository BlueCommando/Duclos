import { useFocusEffect } from '@react-navigation/native';
import React, { Ref } from 'react';
import { Alert, Linking, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

type CameraView = {
  camera: Ref<Camera> | null
}

let state = 0;

const cameraView = ({ camera }: CameraView) => {
  const { hasPermission, requestPermission } = useCameraPermission()

  const device = useCameraDevice('back')

  if (device == null) return

  const accessCameraPerms = async () => {
    if (hasPermission) return;

    const perm = await requestPermission();
    
    if (perm){
      state++;
    } else {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in Settings.",
        [
          {text: "OK", onPress: () => Linking.openSettings()},
          {text: "Cancel"},
        ]
      );
    }
  };

  useFocusEffect(() => {
    setTimeout(() => accessCameraPerms(), 500);
  });

  return (
    hasPermission && (
        <Camera 
          style={StyleSheet.absoluteFill}
          ref={camera} 
          device={device}
          photo={true}
          isActive={true}
          key={state}
        />
      )
    )
}

export default cameraView