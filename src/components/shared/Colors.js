import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from '../../utils/icons'
import { useTheme } from '../../context/theme/ThemeContext'


const colorsArray = [
    {
        "name": "437C90",
        "hex": "#437C90"
    },
    {
        "name": "255957",
        "hex": "#255957"
    },
    {
        "name": "EEEBD3",
        "hex": "#EEEBD3"
    },
    {
        "name": "A98743",
        "hex": "#A98743"
    },
    {
        "name": "F7C548",
        "hex": "#F7C548"
    },
    {
        "name": "FFFFFF",
        "hex": "#FFFFFF"
    },
    {
        "name": "246EB9",
        "hex": "#246EB9"
    },
    {
        "name": "4CB944",
        "hex": "#4CB944"
    },
    {
        "name": "F5EE9E",
        "hex": "#F5EE9E"
    },
    {
        "name": "F06543",
        "hex": "#F06543"
    },
]


const Colors = () => {
    const { colors } = useTheme();
    const [selectedColor, setSelectedColor] = useState("")
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {colorsArray.map((item, index) => {
                return <TouchableOpacity onPress={() => setSelectedColor(item.name)} style={{
                    width: 30, height: 30,
                    backgroundColor: item.hex, justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: colors.borderColor
                }}>
                    {selectedColor === item.name && <View style={{ width: 30, height: 30, backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='check' color='#fff' type='entypo' />
                    </View>}
                </TouchableOpacity>
            })}
        </View>
    )
}

export default Colors

const styles = StyleSheet.create({})