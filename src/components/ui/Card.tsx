import React from "react";
import { View as RNView, ViewProps } from "react-native";
import { cssInterop } from "nativewind";

import { useThemeColor } from "@/hooks";
import { cn } from "@/lib/utils";

const View = cssInterop(RNView, { className: "style" });

type CardProps = ViewProps & {
  children: React.ReactNode;
  className?: string;
  lightColor?: string;
  darkColor?: string;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  lightColor,
  darkColor,
  style,
  ...props
}) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "card");
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      className={cn("rounded-lg shadow-sm overflow-hidden", className)}
      style={[{ backgroundColor, borderColor, borderWidth: 1 }, style]}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <View className={cn("p-6", className)} {...props}>
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <View className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <View className={cn("flex-row items-center p-6 pt-0", className)} {...props}>
      {children}
    </View>
  );
};
