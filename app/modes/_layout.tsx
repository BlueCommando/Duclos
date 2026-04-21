import useTheme from '@/hooks/useTheme'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Text } from 'react-native'

const placeholderImagePath = "@/assets/app/PLACEHOLDER.png"

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
              source={require(placeholderImagePath)}
              style={{ width: size, height: size }}
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
              source={require(placeholderImagePath)}
              style={{ width: size, height: size }}
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
              source={require(placeholderImagePath)}
              style={{ width: size, height: size }}
            />
          )
        }
      }
      />

    </Tabs>
  )
}

export default modesLayout