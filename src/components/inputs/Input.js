import { StyleSheet, Text, TextInput, View, TextInputProps, ViewStyle, TextStyle, TouchableOpacity, } from 'react-native'
import React, { createElement, useCallback, useState } from 'react'
import { useTheme } from '../../context/theme/ThemeContext';
import Icon from '../../utils/icons';
import { Fonts } from '../../utils/typography';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';




/**
 * 
 * @param {{
 * inputProps: TextInputProps
 * wrapperStyle:ViewStyle,
 * textInputStyle:ViewStyle | TextStyle,
 * label:string, 
 * labelStyle:TextStyle,
 * placeholder:string,
 * leftIcon:React.JSX,
 * rightIcon:React.JSX,
 * isError:boolean,
 * multiline:boolean,
 * secureEntry:boolean,
 * bottomSheetInput:boolean
 * }}
 * @returns 
 */

const Input = ({ wrapperStyle, textInputStyle, labelStyle, label, inputProps, leftIcon, rightIcon, isError, placeholder, multiline, secureEntry, onChangeText, errorMessage, keyboardType, passwordVisible, value, onBlur, onFocus, bottomSheetInput }) => {
    const { colors } = useTheme()
    const isKeyExists = (object) => object?.hasOwnProperty('icon');
    const [isPasswordVisible, setPasswordVisible] = useState(secureEntry)
    const isRequired = label?.includes('*');

    const { shouldHandleKeyboardEvents } = bottomSheetInput ? useBottomSheetInternal() : { shouldHandleKeyboardEvents: { value: false } };

    const handleOnFocus = useCallback(
        args => {
            shouldHandleKeyboardEvents.value = true;
            if (onFocus) {
                onFocus(args);
            }
        },
        [onFocus, shouldHandleKeyboardEvents]
    );
    const handleOnBlur = useCallback(
        args => {
            shouldHandleKeyboardEvents.value = false;
            if (onBlur) {
                onBlur(args);
            }
        },
        [onBlur, shouldHandleKeyboardEvents]
    );

    const bottomSheetProps = bottomSheetInput ? {
        onFocus: handleOnFocus,
        onBlur: handleOnBlur
    } : {}

    return (
        <View style={[styles.wrapper, wrapperStyle]}>
            <View style={{ flexDirection: 'row' }}>
                {label && <>
                    <Text style={[styles.label, labelStyle, { color: colors.blackPrimary }]}>{isRequired ? label.replace('*', '') : label}</Text>
                    {isRequired && <Text style={styles.asterisk}>*</Text>}
                </>}
            </View>
            <View style={[styles.input, { borderColor: isError ? colors.error : colors.borderColor, backgroundColor: colors.placeholder, }]}>
                {isKeyExists(leftIcon) && <TouchableOpacity onPress={() => isKeyExists(leftIcon) && leftIcon?.handler()}>
                    {isKeyExists(leftIcon) ? leftIcon?.icon : leftIcon}
                </TouchableOpacity>}
                <TextInput
                    style={[styles.textInput, { color: colors.blackPrimary }, textInputStyle, multiline && styles.multiline,]}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={colors.placeholderText}
                    multiline={multiline}
                    secureTextEntry={isPasswordVisible}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    {...bottomSheetProps}
                    {...inputProps}
                />
                {secureEntry && <TouchableOpacity style={{ padding: 8, }} onPress={() => setPasswordVisible(!isPasswordVisible)}>
                    {!isPasswordVisible ? <Icon name='eye' type='ionicons' size={18} color={colors.blackPrimary} /> : <Icon name='eye-off' type='ionicons' size={18} color={colors.blackPrimary} />}
                </TouchableOpacity>}
                <TouchableOpacity onPress={() => isKeyExists(rightIcon) && rightIcon?.handler()}>
                    {isKeyExists(rightIcon) ? rightIcon?.icon : rightIcon}
                </TouchableOpacity>
            </View>
            {isError && <Text style={[styles.invalidFeedback, { color: colors.error }]}>{errorMessage}</Text>}
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    label: {
        fontFamily: Fonts.primary_Medium,
        fontSize: 14,
        marginBottom: 4
    },
    textInput: {
        height: 43,
        fontFamily: Fonts.primary_Medium,
        fontSize: 14,
        flex: 1,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
    },
    invalidFeedback: {
        fontSize: 12,
        fontFamily: Fonts.primary_Regular,
        textAlign: 'left',
        marginTop: 3
    },
    multiline: {
        minHeight: 150,
        paddingTop: 10,
        textAlignVertical: 'top'
    },
    asterisk: {
        color: 'red',
        fontSize: 14,
        marginLeft: 1,
    }
})