import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import useTheme, { ColorScheme } from '@/hooks/useTheme';

const SinglePhotoOption = () => {
    const theme = useTheme();
    const style = createSinPhoOptStyle(theme);

    return (
        <TouchableOpacity style={style.option}>
            
        </TouchableOpacity>
    )
};

const createSinPhoOptStyle = (color: ColorScheme) => {
    const style = StyleSheet.create({
        option: {
            height: "70%",
            marginTop: 5, 
            aspectRatio: 1,
            borderRadius: "50%",
            backgroundColor: color.subBackground,
        }
    })

    return style
};

export default SinglePhotoOption
