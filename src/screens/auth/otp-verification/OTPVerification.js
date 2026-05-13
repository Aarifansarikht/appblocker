import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../../layout/Container'
import BackButton from '../../../components/buttons/BackButton'
import { CONTAINER_SPACING, SCREEN_HEIGHT } from '../../../utils/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import OtpInputs from '../../../components/inputs/OTPInput'
import { Fonts } from '../../../utils/typography'
import { useTheme } from '../../../context/theme/ThemeContext'
import Button from '../../../components/buttons/Button'
import { useNavigation } from '@react-navigation/native'
import { Navigate_ResetPassword } from '../../../routes/path'

const OTPVerification = () => {
  const { colors } = useTheme();
  const navigation = useNavigation()
  return (
    <Container>
      <BackButton wrapperStyle={{ padding: CONTAINER_SPACING }} title={"OTP Verification"} />
      <KeyboardAwareScrollView contentContainerStyle={{  }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, }}>
          <View style={{ paddingVertical: '10%' }}>
            <Text style={{ fontSize: 15, fontFamily: Fonts.primary_Medium, color: colors.paragraph, textAlign: 'center' }}>Code has been sent to +91 9837****99</Text>
          </View>
          <View style={{ paddingHorizontal: '10%', paddingBottom: '10%' }}>
            <OtpInputs numberOfInputs={4} />
          </View>
          <View style={{ paddingBottom: '10%' }}>
            <Text style={{ fontSize: 15, fontFamily: Fonts.primary_Medium, color: colors.paragraph, textAlign: 'center' }}>Resend Code in 55s</Text>
          </View>
        </View>
       
      </KeyboardAwareScrollView>
      <Button
        wrapperStyle={{
          padding: CONTAINER_SPACING,
        }}
        title={"Verify"}
        onPress={() => navigation.navigate(Navigate_ResetPassword)}

      />
    </Container>
  )
}

export default OTPVerification

const styles = StyleSheet.create({})