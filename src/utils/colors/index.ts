export const ThemeConstants = {
    light: {
        blackPrimary: '#111827',
        activeTintColor: '#100c08',
        inactiveTintColor: '#ccc',
        gray: "#E5E4E2",
        grayLight:"#F3F4F6",
        paragraph: "#343434",
        paragraphLight:"#666666",
        background: "#fff",
        borderColor: "#E5E7EB",
        error: "rgb(255, 68, 51)",
        success: "rgb(11, 218, 81)",
        warning: "rgb(255, 191, 0)",
        whitePrimary: "#fff",
        placeholder: "#F0F0F0",
        placeholderText: "rgb(158,158,158)",
        tabBackground:"#fff",
        tabActive: "#22C55E",
        tabInactive: "#929292",
        accent: "#22C55E",
        label: "#fff",
        buttonDull:"#E2E2E2"
        
    },
    dark: {
        blackPrimary: '#fff', // Inverted
        activeTintColor: '#fff', // Inverted
        inactiveTintColor: '#666', // Adjusted to a darker shade
        gray: "#1A1A1A", // Adjusted to a darker shade
        grayLight: "#0e0e0e",
        paragraph: "#ccc", // Adjusted to a darker shade
        paragraphLight: "#999", // Adjusted to a darker shade
        background: "#1A1A1A", // Adjusted to a darker shade
        borderColor: "#333", // Adjusted to a darker shade
        error: "rgb(255, 68, 51)", // Unchanged
        success: "rgb(11, 218, 81)", // Unchanged
        warning: "rgb(255, 191, 0)", // Unchanged
        whitePrimary: "#100c08", // Inverted
        placeholder: "#333", // Adjusted to a darker shade
        placeholderText: "#999", // Adjusted to a darker shade
        tabActive: "#fff", // Inverted
        tabInactive: "#666", // Adjusted to a darker shade
        tabBackground:"#010101",
        cartButton: "#fff", // Inverted
        accent: "#22C55E",

        cartLabel: "#100c08", // Inverted
        cartButtonDull: "#333" // Adjusted to a darker shade
    }
};

export type ThemeConstantsProps = {
    accent: string;
    blackPrimary: string;
    activeTintColor: string;
    inactiveTintColor: string;
    gray: string;
    grayLight: string;
    paragraph: string;
    background: string;
    borderColor: string;
    error: string;
    success: string;
    warning: string;
    whitePrimary: string;
    placeholder: string;
    placeholderText: string;
    paragraphLight: string;
    tabActive: string;
    tabInactive: string;
    cartButton: string;
    cartLabel: string;
    cartButtonDull: string;
    tabBackground: string;
    

}