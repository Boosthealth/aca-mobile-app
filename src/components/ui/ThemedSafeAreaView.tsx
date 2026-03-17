import { NativeSafeAreaViewProps, Edge } from "react-native-safe-area-context";
import { Platform } from "react-native";

import { SafeAreaView } from "./Styled";

import { useThemeColor } from "@/hooks";
import { ColorName } from "@/constants";

type Props = NativeSafeAreaViewProps & {
  className?: string;
  colorName?: ColorName;
};

export const ThemedSafeAreaView: React.FC<Props> = ({
  style,
  className,
  colorName = "background",
  edges,
  ...props
}) => {
  const backgroundColor = useThemeColor({}, colorName);

  const defaultEdges: Edge[] =
    Platform.OS === "android" ? ["top", "left", "right", "bottom"] : ["top", "left", "right"];

  return (
    <SafeAreaView
      style={[{ backgroundColor }, style]}
      className={className}
      edges={edges || defaultEdges}
      {...props}
    />
  );
};
