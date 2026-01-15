import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useTheme from '@/hooks/useTheme'

const modesLayout = () => {
  const colors = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.primary,

          borderTopWidth: 10,
          borderColor: "yellow",

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
              source={require("../assets/images/wally.png")}
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
              source={require("../assets/images/wally.png")}
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