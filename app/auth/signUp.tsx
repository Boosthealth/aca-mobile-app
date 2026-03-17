import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
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
  CardContent,
  CardFooter,
  Form,
  FormField,
  FormItem,
  FormMessage,
  InputWithLabel,
  PhoneInput,
  Checkbox,
} from "@/components/ui";
import { LogoFullIcon } from "@/components/icons";
import { useAppContext } from "@/providers";
import { SignUpSchema } from "@/schemas";
import { ghlId, ghlLead } from "@/services";

export default function SignUpScreen() {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      project: "boost",
      consentToTerms: false,
    },
  });

  const router = useRouter();
  const { signUp } = useAppContext();

  // Refs for tracking request status
  const hasRequested = useRef(false);
  const retryAttempted = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContactId = async (
    email: string,
    phoneNumber: string,
    retry = true
  ): Promise<string | null> => {
    hasRequested.current = true;

    try {
      const response = await ghlId(email, phoneNumber);

      const { success, contacts, error: apiError } = response;

      if (!success && apiError) {
        setError(`Failed to fetch contact ID. ${apiError}`);
      }

      if (success && contacts.length > 0 && contacts[0]?.id) {
        if (__DEV__) {
          console.log("Found contact in GHL with ID:", contacts[0].id);
        }

        return contacts[0].id;
      } else {
        console.warn("Contact not found in GHL:", apiError || "No contact found");

        if (retry && !retryAttempted.current) {
          retryAttempted.current = true;
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return getContactId(email, phoneNumber, false);
        }

        return null;
      }
    } catch (error) {
      console.error("Request failed:", error);

      if (retry && !retryAttempted.current) {
        retryAttempted.current = true;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return getContactId(email, phoneNumber, false);
      }

      return null;
    }
  };

  const createLead = async (data: z.infer<typeof SignUpSchema>): Promise<string | null> => {
    const leadData = {
      _data: {
        funnel: "2",
        variant: "mobile_app_sign_up",
      },
      "10consentToEnrollment": "true",
      "12consentIncome": "true",
      "9incomeVerification": "true",
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
    };

    try {
      const response = await ghlLead("main", leadData);

      if (response.success) {
        if (__DEV__) {
          console.log("Lead created successfully in GHL. Waiting for contact ID...");
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const contactId = await getContactId(data.email, data.phone);

        if (contactId) {
          if (__DEV__) {
            console.log("Contact ID retrieved after lead creation:", contactId);
          }

          return contactId;
        } else {
          console.warn("Lead created but contact ID not found");
          return null;
        }
      } else {
        console.error("Failed to create lead:", response.error);
        setError("Failed to create contact in GHL");
        return null;
      }
    } catch (error) {
      console.error("Could not create lead:", error);
      setError("Failed to create contact. Please try again.");
      return null;
    }
  };

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      hasRequested.current = false;
      retryAttempted.current = false;

      let contactId = await getContactId(data.email, data.phone, false);

      if (!contactId) {
        contactId = await createLead(data);

        if (!contactId) {
          console.error("Could not find or create contact in GHL.");
          Alert.alert(
            "Registration Error",
            "Unable to process your registration. Please contact support or try again later."
          );
          return;
        }
      }

      const result = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        ghl_id: contactId,
        project: "boost",
      });

      if (result.error) {
        console.error("Supabase signup error:", result.error);
        Alert.alert("Sign Up Failed", result.error);
      } else if (result.message) {
        Alert.alert("Success", result.message, [
          {
            text: "OK",
            onPress: () => {
              form.reset({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                consentToTerms: false,
              });
            },
          },
        ]);
      }
    } catch (err) {
      console.error("Registration error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
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
                      Create Account
                    </Typography>
                    <Typography className="mt-2 text-center">
                      Enter your details to create your account
                    </Typography>
                  </CardHeader>

                  <CardContent className="pb-1">
                    <Form {...form}>
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <InputWithLabel
                              label="First Name"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={!!form.formState.errors.firstName}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <InputWithLabel
                              label="Last Name"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={!!form.formState.errors.lastName}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <PhoneInput
                              label="Phone Number"
                              value={field.value}
                              onChangeText={field.onChange}
                              error={!!form.formState.errors.phone}
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
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <InputWithLabel
                              label="Confirm Password"
                              value={field.value}
                              onChangeText={field.onChange}
                              secureTextEntry
                              autoCapitalize="none"
                              error={!!form.formState.errors.confirmPassword}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="consentToTerms"
                        render={({ field }) => (
                          <FormItem>
                            <Checkbox
                              checked={!!field.value}
                              onPress={() => field.onChange(!field.value)}
                              error={!!form.formState.errors.consentToTerms}
                              label={
                                <Typography variant="sm" className="text-foreground">
                                  I agree to the{" "}
                                  <Typography variant="sm" className="text-primary underline">
                                    Terms & Conditions
                                  </Typography>{" "}
                                  and consent to enrollment verification
                                </Typography>
                              }
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
                        {isLoading ? "Sending..." : "Sign Up"}
                      </Button>
                    </Form>

                    {error && (
                      <View className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
                        <Typography variant="sm" className="text-center text-error">
                          {error}
                        </Typography>
                      </View>
                    )}
                  </CardContent>

                  <CardFooter className="pb-2">
                    <View className="flex flex-1 flex-row justify-center items-center">
                      <Typography variant="sm" className="text-foreground">
                        Already have an account?
                      </Typography>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.replace("/auth/login")}
                      >
                        Sign In
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
