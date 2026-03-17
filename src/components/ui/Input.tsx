import React, { useRef, useState, forwardRef } from "react";
import { Animated, TextInputProps } from "react-native";

import { View, TextInput, TextInputType, Pressable } from "./Styled";

import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { cn, formatPhone } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label: string;
  error?: boolean | string;
}

interface TextAreaProps extends TextInputProps {
  label: string;
  error?: boolean | string;
}

interface PhoneInputProps {
  label: string;
  value?: string;
  onChangeText: (value: string) => void;
  error?: boolean | string;
  className?: string;
  readOnly?: boolean;
}

const InputWithLabel = forwardRef<TextInputType, InputProps>(
  ({ label, value, error, className, secureTextEntry, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isFocused, value]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasError = !!error;

    const labelStyle = {
      position: "absolute" as const,
      left: 16,
      top: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [17, 6],
      }),
      fontSize: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 10],
      }),
      color: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#9ca3af", "#3b82f6"],
      }),
    };

    return (
      <View
        key={`input-container-${label}`}
        className={cn(
          "relative h-14 w-full rounded-lg border border-input bg-background justify-end pb-2",
          className
        )}
        style={[
          {
            borderColor: hasError ? "#ef4444" : isFocused ? "#3b82f6" : "#e5e7eb",
            containerType: "none",
          } as any,
        ]}
      >
        <Animated.Text style={labelStyle} pointerEvents="none" className="font-medium">
          {label}
        </Animated.Text>

        <View className="flex-row items-center px-4" style={{ container: "none" } as any}>
          <TextInput
            ref={ref}
            {...props}
            value={value}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            className="flex-1 text-base text-primary h-9 p-0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {secureTextEntry && (
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              hitSlop={10}
              style={{ container: "none" } as any}
            >
              {isPasswordVisible ? (
                <EyeOffIcon size={20} color="#9ca3af" />
              ) : (
                <EyeIcon size={20} color="#9ca3af" />
              )}
            </Pressable>
          )}
        </View>
      </View>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

const PhoneInput = forwardRef<TextInputType, PhoneInputProps>(
  ({ label, value, onChangeText, error, className, readOnly }, ref) => {
    const handleChangeText = (text: string) => {
      const formatted = formatPhone(text);
      onChangeText(formatted);
    };

    return (
      <InputWithLabel
        ref={ref}
        label={label}
        value={value}
        onChangeText={handleChangeText}
        error={error}
        className={className}
        editable={!readOnly}
        keyboardType="phone-pad"
        maxLength={14}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

const TextAreaWithLabel = forwardRef<TextInputType, TextAreaProps>(
  ({ label, value, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isFocused, value]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasError = !!error;

    const labelStyle = {
      position: "absolute" as const,
      left: 16,
      top: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [17, 6],
      }),
      fontSize: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 10],
      }),
      color: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#9ca3af", "#3b82f6"],
      }),
    };

    return (
      <View
        key={`textarea-container-${label}`}
        className={cn(
          "relative w-full rounded-lg border border-input bg-background pt-6 pb-2",
          className
        )}
        style={[
          {
            borderColor: hasError ? "#ef4444" : isFocused ? "#3b82f6" : "#e5e7eb",
            containerType: "none",
          } as any,
        ]}
      >
        <Animated.Text style={labelStyle} pointerEvents="none" className="font-medium">
          {label}
        </Animated.Text>

        <TextInput
          ref={ref}
          {...props}
          value={value}
          multiline
          textAlignVertical="top"
          className="text-base text-primary px-4 min-h-24 p-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    );
  }
);

TextAreaWithLabel.displayName = "TextAreaWithLabel";

export { InputWithLabel, PhoneInput, TextAreaWithLabel };
