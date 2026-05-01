import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HeaderText = ({title}) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}

export default HeaderText

const styles = StyleSheet.create({})