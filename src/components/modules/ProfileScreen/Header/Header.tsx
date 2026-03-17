import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks";
import { View, Pressable } from "@/components/ui";
import { SettingsIcon } from "@/components/icons";

export function Header() {
  const router = useRouter();

  const primaryColor = useThemeColor({}, "primary");
  const borderColor = useThemeColor({}, "border");

  return (
    <View
      className="px-5 py-2 bg-background"
      style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}
    >
      <View className="flex-row items-center justify-end mb-1">
        <Pressable
          onPress={() => router.push("/profile/settings")}
          className="p-2"
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <SettingsIcon size={24} color={primaryColor} />
        </Pressable>
      </View>
    </View>
  );
}
