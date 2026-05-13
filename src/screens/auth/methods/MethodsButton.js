import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AppleIcon, FacebookIcon, GoogleIcon } from '../../../utils/svg'
import { Fonts } from '../../../utils/typography'
import { useTheme } from '../../../context/theme/ThemeContext'


export const MethodsButton = ({ onPress, children, title, type }) => {
    const { colors } = useTheme();

    if (type === 'small') {
        return <TouchableOpacity style={[styles.button, { borderColor: colors.borderColor, width: 70 }]}>
            {children}
        </TouchableOpacity>
    }

    return <TouchableOpacity style={[styles.button, { borderColor: colors.borderColor }]} onPress={onPress}>
        {children}
        <Text style={[styles.labels, { color: colors.paragraph }]}>Continue With {title}</Text>
    </TouchableOpacity>
}


const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    labels: {
        fontFamily: Fonts.primary_Medium,
        fontSize: 14,
        textAlign: 'center',

    }
})