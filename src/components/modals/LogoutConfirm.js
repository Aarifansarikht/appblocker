import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ModalLayout from './ModalLayout'
import { CONTAINER_SPACING } from '../../utils/constants'
import { useTheme } from '../../context/theme/ThemeContext'
import Button from '../buttons/Button'
import { BottomSheet } from '@rneui/base'
import { Fonts } from '../../utils/typography'
import { useNavigation } from '@react-navigation/native'
import { Navigate_Login } from '../../routes/path'

const LogoutConfirm = ({onClose, isVisible}) => {
    const { colors } = useTheme();
    const navigation  = useNavigation()
    return (
        <ModalLayout visible={isVisible} onClose={onClose&&onClose} layout={'bottom-sheet'} sideGap={0}>
            <View style={{ padding: CONTAINER_SPACING, backgroundColor: colors?.background, width: '100%', borderTopStartRadius: 20, borderTopEndRadius: 20 }} >
                <View>
                    <Text style={{ fontSize: 16, color: colors.error, fontFamily: Fonts.primary_Bold, textAlign: 'center', paddingBottom: CONTAINER_SPACING }}>Logout</Text>
                    <Text style={{ fontSize: 14, color: colors.paragraph, fontFamily: Fonts.primary_Medium, textAlign: 'center', }}>Are you sure want to logout</Text>
                </View>
                <View style={{ paddingVertical: CONTAINER_SPACING * 2, flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Button title='Cancel' isOutLine wrapperStyle={{
                        flex: 1
                    }} onPress={onClose && onClose} />
                    <Button title='Logout' wrapperStyle={{
                        flex: 1
                    }} onPress={() => navigation.navigate(Navigate_Login)}/>
                </View>
            </View>
        </ModalLayout>
    )
}

export default LogoutConfirm

const styles = StyleSheet.create({})