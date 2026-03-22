import { View, Text } from 'react-native'
import React from 'react'
import Draggable from 'react-native-draggable'

const SHUT_THE_HELL_UP = () => {}

const CropBox = () => {
  return (
    <Draggable 
        x={100} 
        y={400} 
        renderSize={10}

        onDrag={SHUT_THE_HELL_UP}
        onShortPressRelease={SHUT_THE_HELL_UP}
        onDragRelease={SHUT_THE_HELL_UP}
        onLongPress={SHUT_THE_HELL_UP}
        onPressIn={SHUT_THE_HELL_UP}
        onPressOut={SHUT_THE_HELL_UP}
        onRelease={SHUT_THE_HELL_UP}
    >
        <View style={{width: 100, height: 100, backgroundColor: "#000"}}>
            <Text>4378j</Text>
        </View>
    </Draggable>
  )
}

export default CropBox