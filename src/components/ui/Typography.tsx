import React from "react";
import { Text as RNText, TextProps } from "react-native";
import { cssInterop } from "nativewind";

import { Fonts } from "@/constants";
import { cn } from "@/lib/utils";

const Text = cssInterop(RNText, { className: "style" });

const variantStyles = {
  h1: "text-3xl font-bold text-primary",
  h2: "text-2xl font-bold text-primary",
  h3: "text-xl font-semibold text-primary",
  lg: "text-lg text-primary",
  p: "text-base text-primary",
  sm: "text-sm text-primary",
  xs: "text-xs text-foreground",
};

type TypographyProps = TextProps & {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
  className?: string;
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "p",
  className = "",
  style,
  ...props
}) => {
  const variantClass = variantStyles[variant] || variantStyles.p;

  return (
    <Text
      className={cn(variantClass, className)}
      style={[{ fontFamily: Fonts?.sans }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};
