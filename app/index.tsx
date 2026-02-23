import aiService from '@/components/ai/aiService';
import IntroText from '@/components/loadingScreen/IntroText';
import LogoBox from '@/components/loadingScreen/LogoBox';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  useEffect(() => {
    const initAI = async () => {
      //await aiService.deviceFillsRequirements()

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

      // Change to main thing
      router.replace("./modes");
    }

    initAI();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LogoBox 
        xPosOffset={-50}
        scale = {100}
        finalRotation={40}
        duration = {1000} 
        source = {require("@/assets/app/logo/GreenBlock.png")}
      />
      <LogoBox 
        xPosOffset={50}
        scale = {100}
        finalRotation={25}
        duration = {1000} 
        source = {require("@/assets/app/logo/BlueBlock.png")}
      />
      <LogoBox 
        xPosOffset={0}
        yPosOffset={-75}
        scale = {100}
        finalRotation={-25}
        duration = {1000} 
        source = {require("@/assets/app/logo/PinkBlock.png")}
      />

      <IntroText
        text='DUCLOS'
        letterSpacing={10}
        yPosOffset={75}
        duration={1000}
      />
    </SafeAreaView>
  )
}
