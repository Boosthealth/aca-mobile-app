import "../global.css";

import "react-native-url-polyfill/auto";

import { Stack, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { vars } from "nativewind";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import * as Sentry from "@sentry/react-native";

import { LoadingScreen } from "@/screens";
import { ThemeProvider, useTheme, AppProvider, useAppContext } from "@/providers";
import { Colors } from "@/constants";
import { View, Button, ErrorBoundary } from "@/components/ui";
import { initSentry } from "@/lib/sentry";

initSentry();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function ThemedContainer({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();

  const themeVars = vars({
    "--app-color-scheme": colorScheme,
  });

  return (
    <View
      key="root-stable-container"
      className={colorScheme === "dark" ? "dark" : ""}
      style={[{ flex: 1 }, themeVars, { containerType: "none" } as any]}
    >
      {children}
    </View>
  );
}

function RootLayoutNav() {
  const { colorScheme } = useTheme();
  const { isLoading, isAuthenticated } = useAppContext();
  const [isAppReady, setIsAppReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      setIsAppReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isAppReady) return;

    const inAuthGroup = segments[0] === "auth";
    const isConfirmPage = inAuthGroup && segments[1] === "confirm";

    if (!isAuthenticated) {
      if (!inAuthGroup && !isConfirmPage) {
        router.replace("/auth/login");
      }
    } else {
      if (inAuthGroup && !isConfirmPage) {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, isAppReady, segments, router]);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="webview"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Edit My Insurance",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerTintColor: Colors[colorScheme ?? "light"].primary,
          headerLeft: () => (
            <Button
              variant="ghost"
              onPress={() => router.back()}
              size="sm"
              textClassName="font-normal"
            >
              close
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: "Support",
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}

function RootLayoutContent() {
  return (
    <ThemedContainer>
      <RootLayoutNav />
    </ThemedContainer>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <RootLayoutContent />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
});
