import aiService from '@/components/ai/aiService';
import { useState } from 'react';
import { Image, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// finish loading screen


const test = async (msg: string) => {
  await aiService.init({
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

  const response = await aiService.imageCompletion({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: await aiService.imageToBase64(require("@/assets/app/questions/q2.png")),
            },
          }
        ],
      },
      {
        role: "system",
        content: "Your job is to solve the problem from the given image."
      },
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
