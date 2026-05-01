import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

const Overlay = ({ onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress && onPress} style={StyleSheet.absoluteFillObject}>
            <View style={[StyleSheet.absoluteFillObject, {
                backgroundColor: "#2A415366"
            }]} />
        </TouchableWithoutFeedback>
    )
}

export default Overlay

const styles = StyleSheet.create({})