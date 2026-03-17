import { Platform } from "react-native";

export const Colors = {
  light: {
    background: "#FFFFFF",
    foreground: "#0A0A0A",
    card: "#FFFFFF",
    cardForeground: "#0A0A0A",
    primary: "#000000",
    primaryForeground: "#1C1C1C",
    secondary: "#F49237",
    secondaryForeground: "#DE7D28",
    muted: "#F5F5F4",
    mutedForeground: "#726D69",
    blue: "#0A72D5",
    blueForeground: "#2C7DBF",
    lightBlue: "#F0FAFF",
    border: "#E7E5E4",
    tint: "#F49237",
    icon: "#726D69",
    tabIconDefault: "#726D69",
    tabIconSelected: "#F49237",
    accent: "#22c55e",
    error: "#ef4444",
    white: "#FFFFFF",
  },
  dark: {
    background: "#0A0A0A",
    foreground: "#FAFAF9",
    card: "#1C1C1C",
    cardForeground: "#FAFAF9",
    primary: "#FFFFFF",
    primaryForeground: "#E5E5E5",
    secondary: "#F49237",
    secondaryForeground: "#FFB366",
    muted: "#292524",
    mutedForeground: "#A8A29E",
    blue: "#3B9BF0",
    blueForeground: "#5AAFFF",
    lightBlue: "#1C2937",
    border: "#292524",
    tint: "#F49237",
    icon: "#A8A29E",
    tabIconDefault: "#A8A29E",
    tabIconSelected: "#F49237",
    accent: "#22c55e",
    error: "#ef4444",
    white: "#FFFFFF",
  },
};

export type ColorName = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
