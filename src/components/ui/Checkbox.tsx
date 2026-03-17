import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cssInterop } from "nativewind";

import { View } from "./Styled";
import { Typography } from "./Typography";

import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const StyledTouchable = cssInterop(TouchableOpacity, { className: "style" });

interface CheckboxProps extends Omit<TouchableOpacityProps, "onPress"> {
  checked: boolean;
  onPress: () => void;
  label?: React.ReactNode;
  error?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  error,
  className,
  ...props
}) => {
  return (
    <StyledTouchable
      onPress={onPress}
      activeOpacity={0.7}
      className={cn("flex-row items-start gap-3", className)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={typeof label === "string" ? label : undefined}
      {...props}
    >
      <View
        className={cn(
          "w-6 h-6 rounded-md border items-center justify-center mt-0.5 flex-shrink-0 bg-transparent",
          error && !checked
            ? "border-error"
            : checked
              ? "border-blue bg-card"
              : "border-blue-foreground"
        )}
      >
        {checked && <CheckIcon color="#2C7DBF" />}
      </View>

      {label && (
        <View className="flex-1" style={{ container: "none" } as any}>
          {typeof label === "string" ? (
            <Typography variant="sm" className="text-foreground">
              {label}
            </Typography>
          ) : (
            label
          )}
        </View>
      )}
    </StyledTouchable>
  );
};
