import { ColorName, Colors } from "@/constants";
import { useTheme } from "@/providers";

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ColorName) {
  const { colorScheme } = useTheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorScheme][colorName];
  }
}
