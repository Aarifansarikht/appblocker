import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../../utils/icons'
import { useTheme } from '../../context/theme/ThemeContext'
import { Fonts } from '../../utils/typography'
import { HiFiveHandIcon } from '../../utils/svg'
import { ImagePath } from '../../utils/images'

const MainHeader = () => {
    const { colors } = useTheme()
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',backgroundColor: colors.background ,paddingVertical:"2%"}}>
            <View style={{ flex: 1, paddingRight: '10%', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ paddingRight: '2%',}}>
                         <Image source={ImagePath.greenLogo} style={{ width: 38, height: 38 }} />
                       </View>
                <Text style={{ fontFamily: Fonts.primary_Bold, fontSize: 20, color: colors.accent}} numberOfLines={1}>ScreenToSkill</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 5 }}>
                <View style={{ position: 'relative', width: 30, alignItems: 'flex-end' }}>
                    <Icon name='bell' type='feather' size={20} color={colors?.paragraph} />
                  
                </View>
                {/* <Icon name='heart' type='feather' size={20} color={colors?.paragraph} /> */}
            </View>
        </View>
    )
}

export default MainHeader

const styles = StyleSheet.create({})