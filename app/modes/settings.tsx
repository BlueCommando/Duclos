import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useTheme from '@/hooks/useTheme'
import { createSettingsStyle } from '@/assets/styles/modes/settings.style'

const settings = () => {
  const theme = useTheme();
  const stylesheet = createSettingsStyle(theme);

  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView>
        <View style={stylesheet.innerScrollView}>

          {/*Delete all chats*/}
          <View style={stylesheet.basicSettingBox}>
            
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default settings