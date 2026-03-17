import {
  View as RNView,
  Pressable as RNPressable,
  ActivityIndicator as RNActivityIndicator,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import React from "react";

const stableConfig = {
  className: {
    target: "style" as const,
    nativeStyleToProp: {
      containerType: "none",
      container: "none",
    } as any,
  },
};

export const View = cssInterop(RNView, stableConfig);
export const Pressable = cssInterop(RNPressable, { className: "style" });
export const ActivityIndicator = cssInterop(RNActivityIndicator, { className: "style" });
export const SafeAreaView = cssInterop(RNSafeAreaView, { className: "style" });

const InteropTextInput = cssInterop(RNTextInput, { className: "style" });
export const TextInput = InteropTextInput as unknown as React.ForwardRefExoticComponent<
  any & { className?: string }
>;
export type TextInputType = RNTextInput;
