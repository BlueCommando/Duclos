import { router, Stack } from "expo-router";
import { HeaderBackButton } from '@react-navigation/elements';
import { Alert } from "react-native";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
      headerTitle: "Temporary Chat",
      headerTitleAlign: "center",
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            Alert.alert(
              "Confirmation:", 
              "Exiting the Temporary Chat will delete everything. Are you sure?", 
              [
                {text: "YES", onPress: () => router.replace("/modes/imagery")},
                {text: "NO"}
              ],
            );
          }}
        />
      ),
    }}>
      <Stack.Screen name="index"/>
    </Stack>
  )
}
