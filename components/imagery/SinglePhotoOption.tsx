import useTheme, { ColorScheme } from '@/hooks/useTheme';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

type SinglePhotoOptionProps = {
    onPress?: () => void,
    source?: ImageSourcePropType,
}

const SinglePhotoOption = ({ onPress, source }: SinglePhotoOptionProps) => {
    const theme = useTheme();
    const style = createSinPhoOptStyle(theme);

    return (
        <TouchableOpacity style={style.option} onPress={onPress}>
            <Image source={source} style={style.image}/>
        </TouchableOpacity>
    )
};

const createSinPhoOptStyle = (color: ColorScheme) => {
    const style = StyleSheet.create({
        container: {
            flex: 1
        },

        option: {
            height: "70%",
            marginTop: 5, 
            aspectRatio: 1,
            borderRadius: "50%",
            backgroundColor: color.subBackground,
            overflow: "hidden",
        },

        image: {
            width: "100%",
            height: "100%",
        },
    })

    return style
};

export default SinglePhotoOption
