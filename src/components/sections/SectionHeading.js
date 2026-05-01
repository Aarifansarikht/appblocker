import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../utils/typography';


/**
 * 
 * @param {{
 * title:string,
 * label:string,
 * wrapperStyle:ViewStyle
 * 
 * }} param0 
 * @returns 
 */

const SectionHeading = ({ title, label = "See All", wrapperStyle, onPressLabel }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.headerHeadings, wrapperStyle]}>
            <Text style={{ fontFamily: Fonts.primary_SemiBold, fontSize: 16, color: colors.blackPrimary }}>{title}</Text>
            <Text onPress={onPressLabel && onPressLabel} style={{ fontFamily: Fonts.primary_SemiBold, fontSize: 13, color: colors.blackPrimary }}>{label}</Text>
        </View>
    )
}

export default SectionHeading

const styles = StyleSheet.create({
    headerHeadings: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: '3%',
    }
})