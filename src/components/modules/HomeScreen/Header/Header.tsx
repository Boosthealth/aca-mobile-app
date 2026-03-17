import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks";
import { View, Pressable } from "@/components/ui";
import { LogoIcon, UserCircleIcon } from "@/components/icons";

export default function Header() {
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const secondaryColor = useThemeColor({}, "secondary");

  return (
    <View
      className="flex-row items-center justify-between px-5 py-2 rounded-b-xl"
      style={{ backgroundColor: backgroundColor }}
    >
      <LogoIcon width={42} height={42} />

      <View className="flex-row items-center">
        <Pressable onPress={() => router.replace("/(tabs)/profile")} className="relative">
          <UserCircleIcon size={24} color={secondaryColor} />
        </Pressable>
      </View>
    </View>
  );
}
