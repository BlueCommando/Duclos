import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type LoadingBarProps = {
  curPhase: number,
  maxPhase: number,
  /**Must be between 0 to 1.*/
  percentage: number,
  description: string,
}

const LoadingBar = ({curPhase, maxPhase, percentage, description}: LoadingBarProps) => {
  const beginningFullPercentage = curPhase / maxPhase;
  const phasePerPercentage = 1 / maxPhase;

  const fullPercentage = 100 * (beginningFullPercentage + percentage * phasePerPercentage);
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

const styles = StyleSheet.create({
  bottomCenterView: {
    justifyContent: "flex-end", 
    alignItems: "center", 
    flex: 1,
  },

  percentageView: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
  },

  percentageText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
    textShadowRadius: 3,
    textShadowColor: "#ffffff",
  },

  infoText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    textShadowRadius: 3,
    textShadowColor: "#ffffff",
  },

  backgroundBar: {
    width: "80%",
    height: 50,
    margin: 10,
    borderWidth: 5,
    borderColor: "#004503",
    borderRadius: 25,
    justifyContent: "center",
    overflow: "hidden",
  },

  bar: {
    //width: "50%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: "#00C70E",
    justifyContent: "center",
  },

  innerBar: {
    width: "98%",
    height: "90%",
    borderRadius: 25,
    alignSelf: "center",
    backgroundColor: "#004503",
  },
})

export default LoadingBar
