import { ThemeProvider } from "@/hooks/useTheme";
import * as Font from 'expo-font';
import { Stack } from "expo-router";
import { useEffect } from "react";

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

  return (
    <ThemeProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name = "modes"/>
      </Stack>
    </ThemeProvider>
  )
}
