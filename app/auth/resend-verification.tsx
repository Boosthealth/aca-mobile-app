import { useState } from "react";
import { Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BlurView } from "expo-blur";

import {
  ScreenContainer,
  View,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Typography,
  Button,
  ThemedSafeAreaView,
  Form,
  FormField,
  FormItem,
  FormMessage,
  InputWithLabel,
} from "@/components/ui";
import { LogoFullIcon } from "@/components/icons";
import { useAppContext } from "@/providers";
import { ResendVerificationSchema } from "@/schemas";

export default function ResendVerificationScreen() {
  const router = useRouter();
  const { resendVerification } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ResendVerificationSchema>>({
    resolver: zodResolver(ResendVerificationSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof ResendVerificationSchema>) => {
    setIsLoading(true);

    try {
      const result = await resendVerification(data.email);

      if (result.error) {
        Alert.alert("Error", result.error);
      } else if (result.message) {
        Alert.alert("Success", result.message, [
          {
            text: "OK",
            onPress: () => {
              form.reset();
              router.replace("/auth/login");
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to resend verification email, ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

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
            <View className="flex-1 justify-center items-center p-5">
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
                      Resend Verification
                    </Typography>
                    <Typography className="text-center mt-2">
                      Enter your email to receive a new verification link
                    </Typography>
                  </CardHeader>

                  <CardContent>
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

                      <Button
                        size="lg"
                        onPress={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="mt-4"
                      >
                        {isLoading ? "Sending..." : "Resend Verification Email"}
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        onPress={() => router.back()}
                        className="mt-4"
                      >
                        Back to Sign In
                      </Button>
                    </Form>
                  </CardContent>
                  <CardFooter className="pb-4">
                    <Typography variant="sm" className="text-center text-primary-foreground">
                      Didn&apos;t receive the email? Check your spam folder or try resending.
                    </Typography>
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
