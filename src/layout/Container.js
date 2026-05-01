/* eslint-disable react-native/no-inline-styles */
import { View, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component, Fragment } from 'react';
import { StatusBar } from './StatusBar';
import { color } from '../utils/colors';
import { useTheme } from '../context/theme/ThemeContext';

const Container = ({ statusBarColor, barStyle, children }) => {
    const { colors, theme } = useTheme();
    let statusBar = statusBarColor ? statusBarColor : colors.background;
    let barStyles = barStyle ? barStyle : theme === 'light' ? 'dark-content' : 'light-content';
    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: statusBar }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <StatusBar statusBarColor={statusBar} barStyle={barStyles} />
                <View style={{ flex: 1 }}>{children}</View>
            </SafeAreaView>
        </Fragment>
    )
}

export default Container

