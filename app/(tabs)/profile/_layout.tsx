import { Stack } from "expo-router";

import { ProfileProvider } from "@/providers";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

export default function ProfileLayout() {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ProfileProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.primary,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </ProfileProvider>
  );
}
