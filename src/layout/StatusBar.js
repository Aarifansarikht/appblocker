/* eslint-disable react-hooks/exhaustive-deps */
import { StatusBar as StatusBarComponent, Platform } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/theme/ThemeContext';


export function StatusBar({ statusBarColor, barStyle }) {
    const {theme} = useTheme()
    useFocusEffect(
        React.useCallback(() => {
            StatusBarComponent.setBarStyle(barStyle ? barStyle : 'dark-content');
            if (Platform.OS === 'android') {
                StatusBarComponent.setBackgroundColor(statusBarColor);
            }
        }, [theme]),
    );
}