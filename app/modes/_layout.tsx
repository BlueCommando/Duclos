import useTheme from '@/hooks/useTheme'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image } from 'react-native'

const modesLayout = () => {
  const colors = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,

          borderTopWidth: 2,
          borderColor: colors.border,

          paddingTop: 10,
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: 20,
        },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Chat",
          tabBarIcon: ({size}) => (
            <Image
              source={colors.assets.chat}
              style={{ width: 35, height: 35 }}
            />
          )
        }
      }
      />

      <Tabs.Screen
        name='imagery'
        options={{
          title: "Imagery",
          tabBarIcon: ({size}) => (
            <Image
              source={colors.assets.imagery}
              style={{ width: 35, height: 35 }}
            />
          )
        }
      }
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          tabBarIcon: ({size}) => (
            <Image
              source={colors.assets.settings}
              style={{ width: 40, height: 40 }}
            />
          )
        }
      }
      />

    </Tabs>
  )
}

export default modesLayout