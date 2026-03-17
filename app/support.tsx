import { useState } from "react";
import { Alert, ScrollView, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Pressable,
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
  TextAreaWithLabel,
} from "@/components/ui";
import { LogoFullIcon } from "@/components/icons";
import { LoadingScreen } from "@/screens";
import { AccountSupportSchema } from "@/schemas";
import { ghlLead } from "@/services";

export default function ContactSupportScreen() {
  const router = useRouter();
  const { email = "" } = useLocalSearchParams();

  const form = useForm<z.infer<typeof AccountSupportSchema>>({
    resolver: zodResolver(AccountSupportSchema),
    defaultValues: { email: email as string, message: "" },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof AccountSupportSchema>) => {
    setIsLoading(true);

    try {
      const response = await ghlLead("main", data);

      if (response.error) {
        Alert.alert("Error", `Failed to send message to support service, ${response.error}`);
      } else {
        Alert.alert(
          "Thank You!",
          "Your message has been sent successfully. We will review it and respond to you shortly.",
          [
            {
              text: "Go To Account",
              onPress: () => router.replace("/(tabs)/profile"),
            },
          ]
        );
      }
    } catch (leadError) {
      console.error("Could not send support lead:", leadError);
      Alert.alert("Error", `Failed to send message to support service, ${leadError}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemedSafeAreaView className="flex-1">
      <ScreenContainer>
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
            <View className="flex-col items-center p-5">
              {/* Logo */}
              <View className="mb-8">
                <LogoFullIcon width={180} height={90} />
              </View>

              <Card className="rounded-xl">
                <CardHeader className="py-4">
                  <Typography variant="h2" className="text-center">
                    Support
                  </Typography>
                  <Typography className="mt-2 text-center">
                    Please let us know about any issues you are experiencing.
                  </Typography>
                </CardHeader>

                <CardContent className="pb-4">
                  {/* Support form */}
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
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <TextAreaWithLabel
                            label="Message"
                            value={field.value}
                            onChangeText={field.onChange}
                            error={!!form.formState.errors.message}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      size="lg"
                      onPress={form.handleSubmit(onSubmit)}
                      className="mb-0"
                      disabled={isLoading}
                    >
                      Send
                    </Button>
                  </Form>
                </CardContent>

                <CardFooter className="flex-col pb-4 gap-2">
                  <Typography variant="sm" className="text-foreground">
                    Prefer A Phone Call? We Are Here To Help!
                  </Typography>
                  <View className="flex flex-row justify-center items-center gap-2">
                    <Typography variant="p" className="text-blue font-bold">
                      Mon - Fri, 7 AM - 4 PM PT
                    </Typography>
                    <Pressable onPress={() => Linking.openURL("tel:+18886087770")}>
                      <Typography variant="p" className="text-secondary font-bold">
                        (888) 608 - 7770
                      </Typography>
                    </Pressable>
                  </View>
                </CardFooter>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
