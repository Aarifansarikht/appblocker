import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SelectDropdown from 'react-native-select-dropdown';
import Icon from '../../utils/icons';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';

const SelectDropDown = ({ onSelect, placeholder, data, value, dropdownButtonStyle, dropdownButtonTxtStyle, labelStyle, label, wrapperStyle }) => {
    const { colors } = useTheme()
    return (
        <View style={wrapperStyle}>
            {label && <>
                <Text style={[styles.label, labelStyle, { color: colors.blackPrimary }]}>{label}</Text>
            </>}
            <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => onSelect && onSelect(selectedItem, index)}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={[styles.dropdownButtonStyle, dropdownButtonStyle, { backgroundColor: colors.placeholder, borderColor: colors.borderColor }]}>
                            <Text style={[styles.dropdownButtonTxtStyle, dropdownButtonTxtStyle, { color: (selectedItem && selectedItem.title) ? colors.paragraph : colors.placeholderText }]}>
                                {(selectedItem && selectedItem.title) || placeholder}
                            </Text>
                            <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} size={20} color={colors.paragraph} style={styles.dropdownButtonArrowStyle} />
                        </View>
                    );
                }}
                defaultValue={value}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: colors.grayLight }) }}>
                            <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                            <Text style={[styles.dropdownItemTxtStyle, { color: colors.paragraph }]}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </View>
    )
}

export default SelectDropDown

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        height: 43,
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 15,
        fontFamily: Fonts.primary_Medium
    },
    dropdownButtonArrowStyle: {

    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',

        fontFamily: Fonts.primary_Medium,
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    label: {
        fontFamily: Fonts.primary_Medium,
        fontSize: 14,
        marginBottom: 4
    },
})