// App.jsx
import { Text, View, TouchableOpacity, Platform } from 'react-native';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import Icon from '../utils/icons';
import { ThemeConstants } from '../utils/colors';
import { Fonts } from '../utils/typography';


const commonToastStyle = {
    backgroundColor: ThemeConstants.light.background,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '95%',
    paddingVertical: 14,
    ...Platform.select({
        ios: {
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 30
        },
        android: {
            elevation: 30,
        }
    }),
    shadowColor: "#000",
};

/*
  1. Create the config
*/
export const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
     success: ({ text1 }) => (
        <View style={commonToastStyle}>
            <View>
                <Icon
                    name='check-circle-outline'
                    type='materialIcons'
                    size={22}
                    color={'#22C55E'}
                />
            </View>

            <Text
                style={{
                    flex: 1,
                    paddingLeft: 14,
                    fontFamily: Fonts.primary_Medium,
                    fontSize: 14,
                    color: ThemeConstants.light.blackPrimary,
                }}>
                {text1}
            </Text>

            <TouchableOpacity
                onPress={() => Toast.hide()}
                style={{
                    width: 25,
                    height: 25,
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                <Icon
                    name='close'
                    size={16}
                    color={ThemeConstants.light.blackPrimary}
                />
            </TouchableOpacity>
        </View>
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
      error: ({ text1 }) => (
        <View style={commonToastStyle}>
            <View>
                <Icon
                    name='close-circle'
                    type='AntDesign'
                    size={22}
                    color={'#EF4444'}
                />
            </View>

            <Text
                style={{
                    flex: 1,
                    paddingLeft: 14,
                    fontFamily: Fonts.primary_Medium,
                    fontSize: 14,
                    color: ThemeConstants.light.blackPrimary,
                }}>
                {text1}
            </Text>

            <TouchableOpacity
                onPress={() => Toast.hide()}
                style={{
                    width: 25,
                    height: 25,
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                <Icon
                    name='close'
                    size={16}
                    color={ThemeConstants.light.blackPrimary}
                />
            </TouchableOpacity>
        </View>
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */

    copyLinkToast: ({ text1, props }) => {

        return <View
            style={{
                backgroundColor: ThemeConstants.light.background,
                padding: 14,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: '95%',
                paddingVertical: 14,
                ...Platform.select({
                    ios: {
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 0 },
                        shadowRadius: 30
                    },
                    android: {
                        elevation: 30,
                    }
                }),
                shadowColor: "#000",
            }}>
            <View>
                {props?.icon}
            </View>
            <Text style={{
                flex: 1, paddingLeft: 14, fontFamily: Fonts.primary_Medium, fontSize: 14,
                color: ThemeConstants.light.blackPrimary,
            }}>{text1}</Text>
            <TouchableOpacity onPress={() => Toast.hide()} style={{ width: 25, height: 25, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Icon name='close' size={16} color={ThemeConstants.light.blackPrimary} />
            </TouchableOpacity>
        </View>
    }

};
