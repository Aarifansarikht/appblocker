import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from '../../utils/icons'
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';



export default function BackButton({ size = 18, title, titleColor, titleSize = 15, wrapperStyle }) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <View   style={{ flexDirection: 'row', alignItems: 'center', gap: 8, ...wrapperStyle }}>
            <TouchableOpacity activeOpacity={0.8} style={{
                padding: 5, width: 35, height: 35, borderRadius: 35, justifyContent: 'center',
                alignItems: 'center', borderWidth: 1, borderColor: colors.borderColor, backgroundColor:colors.background
            }} onPress={() => navigation.goBack()}>
                <Icon name='arrowleft' size={20} type='antDesign' color={colors.blackPrimary} />
            </TouchableOpacity>
            {title && <Text style={{ fontFamily: Fonts.primary_SemiBold, color: titleColor ? titleColor : colors.paragraph, fontSize: titleSize }}>{title}</Text>}

        </View>
    )
}

const styles = StyleSheet.create({})