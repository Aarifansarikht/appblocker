import { Platform } from "react-native";

export const Fonts = {
    primary_Bold: Platform.select({ ios: "Poppins-Bold", android: "Poppins-Bold" }),
    


    primary_Regular: Platform.select({ ios: "Poppins-Regular", android: "Poppins-Regular" }),
    primary_Light: Platform.select({ ios: "Poppins-Light", android: "Poppins-Light" }),
    primary_Medium: Platform.select({ ios: "Poppins-Medium", android: "Poppins-Medium" }),
    primary_SemiBold: Platform.select({ ios: "Poppins-SemiBold", android: "Poppins-SemiBold" }),
    primary_ExtraBold: Platform.select({ ios: "Poppins-ExtraBold", android: "Poppins-ExtraBold" }),
    primary_ExtraLight: Platform.select({ ios: "Poppins-ExtraLight", android: "Poppins-ExtraLight" }),
    primary_Thin: Platform.select({ ios: "Poppins-Thin", android: "Poppins-Thin" }) ,
    secondary_Black: Platform.select({ ios: "Roboto-Black", android: "Roboto-Black" }),
    secondary_Bold: Platform.select({ ios: "Roboto-Bold", android: "Roboto-Bold" }),
    secondary_Light: Platform.select({ ios: "Roboto-Light", android: "Roboto-Light" }),
    secondary_Medium: Platform.select({ ios: "Roboto-Medium", android: "Roboto-Medium" }),
    secondary_Regular: Platform.select({ ios: "Roboto-Regular", android: "Roboto-Regular" }),
    secondary_Thin: Platform.select({ ios: "Roboto-Thin", android: "Roboto-Thin" }),
}