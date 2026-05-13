import { StyleSheet, Text, View } from 'react-native';
import { AppleIcon } from '../../../utils/svg';
import { Fonts } from '../../../utils/typography'
import { MethodsButton } from './MethodsButton'
import { useTheme } from '../../../context/theme/ThemeContext';

const AppleAuth = ({ type }) => {
    const {colors}=useTheme()
    return (        
            <MethodsButton title={"Apple"} type={type}>
            <AppleIcon color={colors.blackPrimary} />             
            </MethodsButton>        
    )
}

export default AppleAuth

const styles = StyleSheet.create({      
})