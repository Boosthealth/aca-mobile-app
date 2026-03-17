import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

import { View } from "../ui/Styled";

import { SpinnerIcon } from "./Icon";

import { useThemeColor } from "@/hooks";
import { cn } from "@/lib/utils";

export const Spinner = ({ size = 48, className }: { size?: number; className?: string }) => {
  const color = useThemeColor({}, "secondary");
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View className={cn("flex items-center justify-center", className)}>
      <Animated.View style={animatedStyle}>
        <SpinnerIcon size={size} color={color} />
      </Animated.View>
    </View>
  );
};
