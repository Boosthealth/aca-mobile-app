import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/ui";
import {
  HomeIcon,
  HomeOutlineIcon,
  PersonIcon,
  PersonOutlineIcon,
  ShieldIcon,
  ShieldOutlineIcon,
} from "@/components/icons";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          ...(Platform.OS === "android"
            ? {
                height: 64,
                paddingBottom: 10,
                paddingTop: 8,
              }
            : {
                paddingBottom: 8,
                paddingTop: 8,
              }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <HomeIcon size={size} color={color} />
            ) : (
              <HomeOutlineIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: "Status",
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <ShieldIcon size={size} color={color} />
            ) : (
              <ShieldOutlineIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <PersonIcon size={size} color={color} />
            ) : (
              <PersonOutlineIcon size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
