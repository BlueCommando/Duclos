import { Alert } from "react-native";
import Toast from 'react-native-simple-toast';
import { useChatLogStore } from "../userData/UserChatLogs";

const DeleteAllChats = () => {
  const saveChatLogs = useChatLogStore.getState().saveChatLogs;

  Alert.alert(
    "Confirmation:",
    "Are you sure about DELETING ALL CHATS?",
    [
      {
        text: "YES",
        onPress: () => Alert.alert(
          "Confirmation:",
          "This action is irreversible, are you ABSOLUTELY sure?",
          [
            {
              text: "YES",
              onPress: async () => {
                await saveChatLogs([]);
                Toast.show(`Successfully deleted all Chats!`, 3000);
              }
            },

            {text: "NO",},
          ]
        )
      },

      {text: "NO",},
    ]
  );
}

export default DeleteAllChats
