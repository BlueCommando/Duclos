import useTheme from '@/hooks/useTheme'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Text } from 'react-native'

const modesLayout = () => {
  const colors = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,

          borderTopWidth: 1,
          borderColor: colors.background,

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

      <Tabs.Screen
        name='advancedImagery'
        options={{
          tabBarLabel: ({ color }) => ( 
            <Text style={{ 
              color, 
              textAlign: "center", 
              flexWrap: "wrap", }} 
            > Advanced Imagery </Text> 
          ),
          
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
        name='settings'
        options={{
          title: "Settings",
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