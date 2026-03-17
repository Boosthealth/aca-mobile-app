import React from "react";
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
  Text as RNText,
} from "react-native";
import { cssInterop } from "nativewind";

import { ActivityIndicator } from "./Styled";

import { useThemeColor } from "@/hooks";
import { cn } from "@/lib/utils";

const ButtonText = cssInterop(RNText, { className: "style" });
const StyledButton = cssInterop(RNTouchableOpacity, {
  className: "style",
});

const variants = {
  default: "bg-secondary active:bg-secondary-foreground",
  secondary: "bg-primary active:opacity-80",
  outline: "border-2 border-primary bg-transparent active:bg-muted",
  ghost: "bg-transparent active:bg-muted",
};

const sizes = {
  default: "h-12 px-6",
  sm: "h-9 px-4",
  lg: "h-14 px-8",
};

const textVariants = {
  default: "text-base font-semibold",
  sm: "text-sm font-semibold",
  lg: "text-lg font-bold",
};

type ButtonProps = TouchableOpacityProps & {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  className = "",
  textClassName = "",
  ...props
}) => {
  const secondaryColor = useThemeColor({}, "secondary");
  const primaryColor = useThemeColor({}, "primary");

  const buttonClasses = [
    "items-center justify-center rounded-lg flex-row",
    variants[variant],
    sizes[size],
    disabled || loading ? "opacity-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const getTextColor = () => {
    if (variant === "secondary") return secondaryColor;
    if (variant === "outline" || variant === "ghost") return primaryColor;
    return "#FFFFFF";
  };

  return (
    <StyledButton
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? "primary" : "muted"}
        />
      ) : (
        <ButtonText
          className={cn(textVariants[size], textClassName)}
          style={{ color: getTextColor() }}
        >
          {children}
        </ButtonText>
      )}
    </StyledButton>
  );
};
