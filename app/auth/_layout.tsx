import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="password-reset" />
      <Stack.Screen name="resend-verification" />
    </Stack>
  );
}
