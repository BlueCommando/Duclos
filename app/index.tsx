import aiService from '@/components/ai/aiService';
import IntroText from '@/components/loadingScreen/IntroText';
import LoadingBar from '@/components/loadingScreen/LoadingBar';
import LogoBox from '@/components/loadingScreen/LogoBox';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [phase, changePhase] = useState(0);
  const [percentage, changePercentage] = useState(0);
  const [phaseDesc, changePhaseDesc] = useState("");
  const [isBarVisible, changeBarVisiblity] = useState(false);

  useEffect(() => {
    const initAI = async () => {
      try{

        await aiService.init({

          downloadModel: res => changePercentage(res.bytesWritten / res.contentLength),

          downloadMMProj: res => changePercentage(res.bytesWritten / res.contentLength),

          initModel: alpha => changePercentage(alpha / 100),

          onNewTask: taskName => changePhaseDesc(taskName),

          onTaskEnded: () => {
            changePercentage(0)
            changePhase(phase => phase + 1)
          },

        });

      } catch(e) {
        
        Alert.alert(
          "CRITICAL ERROR OCCURED:", 
          String(e), 
          [{ text: "OK", onPress: () => BackHandler.exitApp() }],
          { cancelable: false, }
        );

        return true;
      }

      // Change to main thing
      setTimeout(() => router.replace("./modes"), 3000);
    }

    setTimeout(() => {
      changeBarVisiblity(true);
      initAI();
    }, 2000)
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

      {isBarVisible && (
        <LoadingBar
          curPhase={phase}
          maxPhase={4}
          percentage={percentage}
          description={phaseDesc}
        />
      )}
    </SafeAreaView>
  )
}
