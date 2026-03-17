import { useState } from "react";
import { Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  ScreenContainer,
  View,
  Button,
  Card,
  CardHeader,
  Typography,
  ThemedSafeAreaView,
  Form,
  FormField,
  FormItem,
  FormMessage,
  InputWithLabel,
  CardContent,
  CardFooter,
} from "@/components/ui";
import { LogoFullIcon } from "@/components/icons";
import { useAppContext } from "@/providers";
import { LoadingScreen } from "@/screens";
import { SignInSchema } from "@/schemas";

export default function LoginScreen() {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();
  const { login } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);

    try {
      const result = await login(data.email, data.password);

      if (result.error) {
        // Check error type
        if (
          result.error.includes("Invalid login credentials") ||
          result.error.includes("Invalid") ||
          result.error.includes("password")
        ) {
          Alert.alert("Login Failed", "Incorrect password. Would you like to reset your password?");
        } else if (result.error.includes("Email not confirmed")) {
          Alert.alert(
            "Email Not Verified",
            "Please verify your email before signing in. Would you like to resend the verification email?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Resend",
                onPress: () => router.push("/auth/resend-verification"),
              },
            ]
          );
        } else {
          Alert.alert("Login Failed", result.error);
        }
      } else if (result.success) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Failed to login", `Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemedSafeAreaView className="flex-1">
      <ScreenContainer backgroundImage={require("../../assets/images/auth-screen-bg.png")}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-between p-5">
              {/* Logo */}
              <View className="flex-1 items-center mb-8">
                <LogoFullIcon width={180} height={90} />
              </View>

              <Card
                className="rounded-xl"
                style={{ borderWidth: 0, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <BlurView tint="default" intensity={15} blurMethod="dimezisBlurView">
                  <CardHeader className="py-4">
                    <Typography variant="h2" className="text-center">
                      Welcome back!
                    </Typography>
                    <Typography className="mt-2 text-center">
                      Enter your credentials to access your account
                    </Typography>
                  </CardHeader>

                  <CardContent className="pb-1">
                    {/* Auth form */}
                    <Form {...form}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <InputWithLabel
                              label="Email Address"
                              value={field.value}
                              onChangeText={field.onChange}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              error={!!form.formState.errors.email}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <InputWithLabel
                              label="Password"
                              value={field.value}
                              onChangeText={field.onChange}
                              secureTextEntry
                              autoCapitalize="none"
                              error={!!form.formState.errors.password}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button size="lg" onPress={form.handleSubmit(onSubmit)} className="mb-0">
                        Sign In
                      </Button>
                    </Form>
                  </CardContent>

                  <CardFooter className="flex-col pb-2">
                    <View className="flex flex-1 flex-row justify-center items-center">
                      <Typography variant="sm" className="text-foreground">
                        Don&apos;t have an account?
                      </Typography>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.replace("/auth/signUp")}
                        disabled={isLoading}
                      >
                        Sign Up
                      </Button>
                    </View>

                    <View className="flex flex-1 flex-row justify-center items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.push("/auth/resend-verification")}
                      >
                        Re-send Verification Email
                      </Button>
                    </View>

                    <View className="flex flex-1 flex-row justify-center items-center">
                      <Typography variant="sm" className="text-foreground">
                        Forgot your password?
                      </Typography>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.push("/auth/password-reset")}
                      >
                        Reset Password
                      </Button>
                    </View>
                  </CardFooter>
                </BlurView>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
