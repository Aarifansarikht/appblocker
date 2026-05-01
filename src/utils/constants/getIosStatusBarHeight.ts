import { useState, useEffect } from "react";
import { NativeModules,  Platform, StatusBar } from "react-native";

const { StatusBarManager } = NativeModules;

export default function useStatusBarHeight() {
    // Initialize w/ currentHeight b/c StatusBar.currentHeight works properly on android on Android
    const [height, setHeight] = useState(StatusBar.currentHeight || 0);

    useEffect(() => {
        if (Platform.OS !== "ios") return;

        StatusBarManager.getHeight(({ height }: { height: number }) => {
            setHeight(height);
        });        
    }, []);

    return height;
}

