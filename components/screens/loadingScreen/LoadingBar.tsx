import { createLoadingBarStyle } from '@/assets/styles/loadingScreen/LoadingBar.style';
import useTheme from '@/hooks/useTheme';
import React from 'react';
import { Text, View } from 'react-native';

type LoadingBarProps = {
  curPhase: number,
  maxPhase: number,
  /**Must be between 0 to 1.*/
  percentage: number,
  description: string,
}

const LoadingBar = ({curPhase, maxPhase, percentage, description}: LoadingBarProps) => {
  // Style
  const appStyle = useTheme();
  const styles = createLoadingBarStyle(appStyle);

  // Math
  const fullPercentage = 100 * (curPhase / maxPhase + percentage * (1 / maxPhase));
  const barPercentage = Math.floor(fullPercentage * 10) / 10;

  const hasDecimal = (Math.floor(fullPercentage) !== barPercentage)
  const displayPercentage = hasDecimal && String(barPercentage) || `${barPercentage}.0`

  return (
    <View style={styles.bottomCenterView}>
      <Text style={styles.infoText}>{curPhase}/{maxPhase}</Text>
      <Text style={styles.infoText}>{description}</Text>

      <View style={styles.backgroundBar}>
        <View style={styles.percentageView}>
          <Text style={styles.percentageText}>{displayPercentage}%</Text>
        </View>

        <View style={[styles.bar, {width: `${barPercentage}%`}]}>
          <View style={styles.innerBar}></View>
        </View>
      </View>
    </View>
  );
}

export default LoadingBar
