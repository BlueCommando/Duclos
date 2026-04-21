import AiService from '@/components/ai/AiService';
import { router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const test = async (msg: string) => {
  await AiService.init({
    downloadModel: res => {
      console.log("AI Model Download:", res.bytesWritten / res.contentLength)
    },
    downloadMMProj: res => {
      console.log("MMProj Download:", res.bytesWritten / res.contentLength)
    },
    initModel: alpha => {
      console.log("initing AI Model:", alpha)
    },
  });

  const response = await AiService.textCompletion({
    messages: [
      {
        role: "user",
        content: msg,
      }

      /*
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: pathToQuestion,
            },
          }
        ],
      },
      {
        role: "system",
        content: "Your job is to solve the problem from the given image."
      },
      */
    ]
  })

  console.log("Response complete!")
  return response.text
  //*/
}

export default function Index() {
  const [msg, changeMsg] = useState("")

  const handleMsg = async () => {
    if (msg.trim() === "") return;
    console.log(`${msg}\n\n`);
    console.log(await test(msg));
  }

  //useFocusEffect(() => router.replace({pathname: "/screens/imagery/TestChat",}))

  return (
    <SafeAreaView>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>I'm just like wally west!</Text>
       <TextInput
          onChangeText={changeMsg}
          onSubmitEditing={handleMsg}

          placeholder='test'
          style={{fontSize: 20}}
        />
      
      <Image
        source={require("@/assets/app/questions/q2.png")}
        
        style={{ width: 400, height: 200 }}
      />
    </SafeAreaView>
  );
}
