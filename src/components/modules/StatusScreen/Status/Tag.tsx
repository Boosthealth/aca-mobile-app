import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

import { View } from "@/components/ui";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

export const Tag = ({ color, animation }: { color: string; animation: boolean }) => {
  const { colorScheme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (animation) {
      progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
    } else {
      progress.value = 0;
    }
  }, [animation, progress]);

  const animatedPingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(progress.value, [0, 1], [1, 2.6]) }],
      opacity: interpolate(progress.value, [0, 1], [0.7, 0]),
    };
  });

  const colors = {
    green: Colors[colorScheme ?? "light"].accent,
    red: Colors[colorScheme ?? "light"].error,
    gray: Colors[colorScheme ?? "light"].mutedForeground,
  };

  const activeColor = colors[color as keyof typeof colors] || colors.gray;

  return (
    <View style={styles.container}>
      {animation ? (
        <View style={styles.wrapper}>
          <Animated.View
            style={[styles.ping, { backgroundColor: activeColor }, animatedPingStyle]}
          />

          <View
            style={[
              styles.dot,
              {
                backgroundColor: activeColor,
                borderColor: Colors[colorScheme ?? "light"].background,
              },
            ]}
          />
        </View>
      ) : (
        <View style={styles.wrapper}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: activeColor,
                borderColor: Colors[colorScheme ?? "light"].background,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ping: { position: "absolute", width: "100%", height: "100%", borderRadius: 99 },
  dot: { width: 12, height: 12, borderRadius: 99, borderWidth: 2 },
});
