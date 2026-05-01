import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/theme/ThemeContext'
import { Fonts } from '../../utils/typography'



/**
 * 
 * @param {{ 
 * isDisable:boolean,
 * onPress:Function, 
 * title:string,
 * isLoading:boolean,
 * isOutLine:boolean,
 * textTransform:string,
 * wrapperStyle:ViewStyle,
 * buttonStyle:ViewStyle,
 * labelStyle:TextStyle
 * }} props Props for the component
 * 
 */
export default function Button({ onPress, isDisable = false, title, isLoading, isOutLine, textTransform = "capitalize", wrapperStyle, isLoadingColor, rightIcon, buttonStyle, labelStyle }) {
    const { colors } = useTheme()
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress && onPress} style={{ borderRadius: 8, ...wrapperStyle }} disabled={isDisable}>
            <View style={{
                backgroundColor: isOutLine ? "transparent" : colors.accent,
                alignItems: 'center',
                paddingVertical: 12,
                height: 45,
                opacity: isDisable ? 0.5 : 1,
                borderWidth: isOutLine ? 1 : 0,
                borderColor: colors.blackPrimary,
                borderRadius: 45,
                paddingHorizontal: 16,       
                ...buttonStyle
            }}>
                {!isLoading ? <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                    <Text style={{ fontSize: 14, fontFamily: Fonts.primary_Medium, color: isOutLine ? colors.blackPrimary : colors.whitePrimary, ...labelStyle }}>{title}</Text>
                    {rightIcon && rightIcon()}
                </View>  :
                    <ActivityIndicator size={27} color={isLoadingColor ? isLoadingColor : colors.whitePrimary} animating />}

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})