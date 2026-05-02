
import { createCheckboxStyle } from '@/assets/styles/settings/CheckBox.style';
import useTheme from '@/hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';

type checkBoxProps = {
  initCheck?: boolean,
  onPressed?: (isChecked: boolean) => void
}

const CheckBox = ({initCheck, onPressed}: checkBoxProps) => {
  const theme = useTheme();
  const stylesheet = createCheckboxStyle(theme);

  const [bool, changeBool] = useState(initCheck);

  const checkedContainer = bool && stylesheet.checkedContainer || {};

  return (
    <TouchableOpacity 
      style={[stylesheet.container, checkedContainer]}
      activeOpacity={1}
      onPress={() => {
        changeBool(prev => {
          onPressed?.(!prev);
          return !prev
        })
      }}
    >
      {bool ? <Image style={stylesheet.fit} source={require("@/assets/app/PLACEHOLDER.png")}/> : null}
    </TouchableOpacity>
  )
}

export default CheckBox
