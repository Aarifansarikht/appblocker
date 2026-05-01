import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

/**
 *
 * @param {{
 * type: "fontAwesome" | "fontAwesome5" | "fontAwesome5Pro" | "antDesign" | "entypo" | "evilIcons" | "feather" | "fontisto" | "foundation" | "ionicons" | "materialCommunityIcons" | "materialIcons" | "octicons" | "simpleLineIcons" | "zocial",
 * name:string,
 * color:string,
 * size:number,
 * onPress:Function,
 *  style: object
 * }} props Props for the component
 *
 */
const Icon = ({ type, name, color = '#000', size = 16, onPress, style }) => {
    switch (type) {
        case 'fontAwesome':
            return (
                <FontAwesome
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'fontAwesome5':
            return (
                <FontAwesome5
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'fontAwesome5Pro':
            return (
                <FontAwesome5Pro
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'antDesign':
            return (
                <AntDesign
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'entypo':
            return (
                <Entypo
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'EvilIcons':
            return (
                <EvilIcons
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'feather':
            return (
                <Feather
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'fontisto':
            return (
                <Fontisto
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'foundation':
            return (
                <Foundation
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'ionicons':
            return (
                <Ionicons
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'materialCommunityIcons':
            <MaterialCommunityIcons
                style={style}
                name={name}
                color={color}
                size={size}
                onPress={onPress && onPress}
            />;
        case 'materialIcons':
            return (
                <MaterialIcons
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'octicons':
            return (
                <Octicons
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'simpleLineIcons':
            return (
                <SimpleLineIcons
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        case 'zocial':
            return (
                <Zocial
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
        default:
            return (
                <Ionicons
                    style={style}
                    name={name}
                    color={color}
                    size={size}
                    onPress={onPress && onPress}
                />
            );
    }
};
export default Icon;