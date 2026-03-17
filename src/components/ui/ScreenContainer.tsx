import {
  View as RNView,
  ImageBackground,
  type ViewProps,
  type ImageSourcePropType,
  type ImageStyle,
} from "react-native";
import { cssInterop } from "nativewind";

import { ColorName } from "@/constants";
import { useThemeColor } from "@/hooks";

export type ThemeViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: ColorName;
  className?: string;
  /** Background image source - when provided the component will render an ImageBackground */
  backgroundImage?: ImageSourcePropType;
  /** Style applied to the underlying image element */
  backgroundImageStyle?: ImageStyle;
  /** Image resize mode (cover/contain/etc) */
  imageResizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
};

const ViewComponent: React.FC<ThemeViewProps> = ({
  style,
  lightColor,
  darkColor,
  colorName = "background",
  backgroundImage,
  backgroundImageStyle,
  imageResizeMode = "cover",
  children,
  ...otherProps
}) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

  // If a background image is provided, render ImageBackground wrapping the content.
  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[{ flex: 1 }, style]}
        imageStyle={backgroundImageStyle}
        resizeMode={imageResizeMode}
      >
        <RNView style={[{ flex: 1 }, style]} {...otherProps}>
          {children}
        </RNView>
      </ImageBackground>
    );
  }

  return (
    <RNView style={[{ flex: 1, backgroundColor }, style]} {...otherProps}>
      {children}
    </RNView>
  );
};

export const ScreenContainer = cssInterop(ViewComponent, {
  className: "style",
});
