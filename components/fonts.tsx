import * as Font from 'expo-font';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Michroma: require('@/assets/fonts/Michroma-Regular.ttf'),
      });
    }

    loadFonts();
  }, []);
}
