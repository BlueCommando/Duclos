import { router, Stack } from "expo-router";
import { HeaderBackButton } from '@react-navigation/elements';
import { Alert } from "react-native";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
      headerTitle: "Camera",
      headerTitleAlign: "center",
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            if (router.canGoBack()){
              router.back();
            } else {
              router.replace("/screens/imagery/TempChat");
            }
          }}
        />
      ),
    }}>
      <Stack.Screen name="index"/>
    </Stack>
  )
}
