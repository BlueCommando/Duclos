import { ThemeProvider } from "@/hooks/useTheme";
import * as Font from 'expo-font';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  // Fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({

        Michroma: require('@/assets/fonts/Michroma-Regular.ttf'),
        
      });
    }

    loadFonts();
  }, []);

  return (<>
    <StatusBar barStyle="dark-content"/>

    <ThemeProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name = "modes"/>
      </Stack>
    </ThemeProvider>
  </>)
}
