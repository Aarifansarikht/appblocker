import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Clipboard } from 'react-native';
import { Fonts } from '../../utils/typography';
import { useTheme } from '../../context/theme/ThemeContext';

const OtpVerification = ({ numberOfInputs }) => {
    const { colors } = useTheme()
    const [otp, setOtp] = useState(Array(numberOfInputs).fill("")); // Array to hold OTP values
    const inputRefs = useRef([]); // Refs for TextInput elements

    // Function to handle OTP input
    const handleOtpInput = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus to the next input box if available
        if (text !== '' && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Auto-fill the OTP if all digits are entered
        if (newOtp.every((digit) => digit !== '')) {
            autoFillOtp(newOtp.join(''));
        }
    };

    // Function to handle backspace press
    const handleBackspace = (index) => {
        if (index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1].focus();
        }
    };

    // Function to handle paste
    const handlePaste = async () => {
        const clipboardContent = await Clipboard.getString();
        const pastedDigits = clipboardContent.replace(/\D/g, '').split(''); // Extract only digits
        const newOtp = [...otp];

        // Distribute pasted digits among the OTP input fields
        pastedDigits.forEach((digit, index) => {
            const newIndex = index < newOtp.length ? index : newOtp.length - 1;
            newOtp[newIndex] = digit;
        });

        setOtp(newOtp);
        inputRefs.current[0].focus(); // Set focus to the first input box
    };

    // Function to auto-fill OTP
    const autoFillOtp = (otpValue) => {
        // Replace this with your auto-fill logic
        console.log('Auto-filled OTP:', otpValue);
        // Example: You can call an API here to verify the OTP automatically
    };

    useEffect(() => {
        // Cleanup function to reset OTP if component unmounts
        return () => setOtp(Array(numberOfInputs).fill(""));
    }, []);

    return (
        <View style={{ flexDirection: 'row', gap: 10 }}>
            {otp.map((value, index) => (
                <TextInput
                    key={index}
                    style={{
                        borderWidth: 1,
                        borderColor: colors.borderColor,
                        width: `${(100 / otp.length) - 2}%`,
                        textAlign: 'center',
                        height: 50,
                        fontFamily: Fonts.primary_SemiBold,
                        fontSize: 14,
                        borderRadius: 14,
                        backgroundColor: colors.placeholder,

                    }}
                    maxLength={1}
                    value={value}
                    onChangeText={(text) => handleOtpInput(text, index)}
                    keyboardType="numeric"
                    ref={(ref) => (inputRefs.current[index] = ref)} // Assign ref to TextInput
                    onKeyPress={({ nativeEvent: { key } }) => {
                        if (key === 'Backspace') {
                            handleBackspace(index);
                        }
                    }}
                    onSelectionChange={(event) => {
                        if (event.nativeEvent.selection.end - event.nativeEvent.selection.start > 1) {
                            handlePaste();
                        }
                    }}
                />
            ))}
        </View>
    );
};

export default OtpVerification;
