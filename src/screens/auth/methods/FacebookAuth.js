import { StyleSheet, Text, View } from 'react-native';
import { FacebookIcon } from '../../../utils/svg';
import { Fonts } from '../../../utils/typography'
import { MethodsButton } from './MethodsButton'

const FacebookAuth = ({type}) => {
    return (
        <MethodsButton title={"Facebook"} type={type}>
            <FacebookIcon />
        </MethodsButton>
    )
}

export default FacebookAuth

const styles = StyleSheet.create({
    labels: {
        fontFamily: Fonts.primary_Medium,
        fontSize: 16,
        // flex: 1,
        textAlign: 'center',

    }
})