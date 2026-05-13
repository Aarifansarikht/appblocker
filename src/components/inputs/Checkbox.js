import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from '../../utils/icons'
import { useTheme } from '../../context/theme/ThemeContext'
import { Fonts } from '../../utils/typography'




const Checkbox = ({ label, onPress, size = 18, labelStyle, isChecked, rounded }) => {
    const { colors } = useTheme()
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.row} onPress={() => onPress && onPress()}>
            <View style={[styles.box, {
                width: size,
                height: size,
                backgroundColor: isChecked ? colors.blackPrimary : colors.whitePrimary,
                borderColor: isChecked ? colors.blackPrimary : colors.blackPrimary,
                borderRadius: rounded ? size : 5
            }]}>
                {isChecked && <Icon name='checkmark' size={size - 2} color={colors.background} />}
            </View>
            {label && <Text style={[styles.label, labelStyle, { color: colors.paragraph }]}>{label}</Text>}

        </TouchableOpacity>
    )
}

export default Checkbox

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    label: {
        fontSize: 12,
        fontFamily: Fonts.primary_SemiBold,

    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,

    }
})