import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Fonts } from '../../utils/typography'
import { useTheme } from '../../context/theme/ThemeContext'

const clothSizes = [
    {
        id: "1",
        label: "S",
        value: "small",
        labelFull: "Small"
    },
    {
        id: "2",
        label: "M",
        value: "medium",
        labelFull: "Medium"
    },
    {
        id: "3",
        label: "L",
        value: "large",
        labelFull: "Large"
    },
    {
        id: "4",
        label: "XL",
        value: "extra-large",
        labelFull: "Extra Large"
    },
]
const shoesSizes = [
    {
        id: "1",
        label: "39",
        value: "39",
    },
    {
        id: "2",
        label: "40",
        value: "40",
    },
    {
        id: "3",
        label: "41",
        value: "41",
    },
    {
        id: "4",
        label: "42",
        value: "42",
    },
]



const Sizes = ({ type = 'cloth' }) => {
    const { colors } = useTheme();
    const [selectedSize, setSelectedSize] = useState("")
    if (type === 'cloth') {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {clothSizes?.map((item, index) => {
                    return <TouchableOpacity style={{
                        width: 35, height: 35, borderWidth: 1,
                        borderRadius: 35,
                        justifyContent: 'center', alignItems: 'center',
                        borderColor: selectedSize === item.id ? colors.borderColor : colors.blackPrimary,
                        backgroundColor: selectedSize === item.id ? colors.blackPrimary : colors.whitePrimary
                    }} onPress={() => setSelectedSize(item?.id)}>
                        <Text style={{ fontFamily: Fonts.primary_SemiBold, color: selectedSize === item.id ? colors.whitePrimary : colors.blackPrimary }}>{item?.label}</Text>
                    </TouchableOpacity>
                })}
            </View>
        )
    }
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {shoesSizes?.map((item, index) => {
                    return <TouchableOpacity style={{
                        width: 35, height: 35, borderWidth: 1,
                        borderRadius: 35,
                        justifyContent: 'center', alignItems: 'center',
                        borderColor: selectedSize === item.id ? colors.borderColor : colors.blackPrimary,
                        backgroundColor: selectedSize === item.id ? colors.blackPrimary : colors.whitePrimary
                    }} onPress={() => setSelectedSize(item?.id)}>
                        <Text style={{ fontFamily: Fonts.primary_SemiBold, color: selectedSize === item.id ? colors.whitePrimary : colors.blackPrimary }}>{item?.label}</Text>
                    </TouchableOpacity>
                })}
            </View>
        </View>
    )
}

export default Sizes

const styles = StyleSheet.create({})