import { useEffect, useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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
} from "@/components/ui";
import {
  LogoFullIcon,
  CheckmarkCircleOutlineIcon,
  AlertCircleOutlineIcon,
  Spinner,
} from "@/components/icons";
import { supabase } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isVerifying = useRef(false);

  // Helper function to check if profile exists
  const checkProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return profile;
  };

  useEffect(() => {
    const tokenHash = (params.token_hash || params.token) as string;
    const accessToken = params.access_token as string;
    const refreshToken = params.refresh_token as string;
    if (!tokenHash && !accessToken && !refreshToken) return;

    const handleEmailConfirmation = async () => {
      if (isVerifying.current) return;
      isVerifying.current = true;
      try {
        if (__DEV__) {
          console.log("[Confirmation] Starting verification for hash:", tokenHash);
        }

        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const profile = await checkProfile(sessionData.session.user.id);
          if (profile) {
            setStatus("success");
            setTimeout(() => router.replace("/(tabs)"), 2000);
            return;
          }
        }
        // 1. Check hash parameters (for OAuth)
        const type = params.type as string;

        if (accessToken && refreshToken && type === "signup") {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Failed to set session:", error);
            setStatus("error");
            setErrorMsg("Failed to establish session. Please try signing in.");
            isVerifying.current = false;
            return;
          }

          if (data.user) {
            // Check if profile exists for this user (important for OAuth sign-ins)
            const profile = await checkProfile(data.user.id);

            if (!profile) {
              // Sign out the user
              await supabase.auth.signOut();

              setStatus("error");
              setErrorMsg("Profile not found. Please complete your registration.");

              setTimeout(() => {
                router.replace("/auth/signUp");
              }, 2000);
              return;
            }

            setStatus("success");
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 2000);
            return;
          }
        }

        // 2. OTP Verification
        const searchType = (params.type as string) || "signup";

        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: searchType as "signup" | "email_change" | "recovery" | "invite",
          });

          if (error) {
            console.error("OTP verification failed:", error);
            setStatus("error");

            if (error.message.includes("expired") || error.message.includes("Token has expired")) {
              setErrorMsg("Confirmation link has expired. Please request a new verification link.");
            } else if (
              error.message.includes("Invalid token") ||
              error.message.includes("Token not found")
            ) {
              setErrorMsg("Invalid verification link. Please check your email and try again.");
            } else if (error.message.includes("Email rate limit exceeded")) {
              setErrorMsg(
                "Too many verification attempts. Please wait a few minutes and try again."
              );
            } else {
              setErrorMsg(`Verification failed: ${error.message}`);
            }
            isVerifying.current = false;
            return;
          }

          if (data.user && data.session) {
            // Check if profile exists
            const profile = await checkProfile(data.user.id);

            if (!profile) {
              // Sign out the user
              await supabase.auth.signOut();

              setStatus("error");
              setErrorMsg("Profile not found. Please complete your registration.");

              setTimeout(() => {
                router.replace("/auth/signUp");
              }, 2000);
              return;
            }

            setStatus("success");

            setTimeout(() => {
              router.replace("/(tabs)");
            }, 2000);
            return;
          }
        }

        // If there is no user or session
        setStatus("error");
        setErrorMsg("Verification failed. No user data returned.");
      } catch (error) {
        isVerifying.current = false;
        console.error("Unexpected verification error:", error);
        setStatus("error");

        if (error instanceof TypeError && error.message.includes("fetch")) {
          setErrorMsg("Network error. Please check your internet connection and try again.");
        } else {
          setErrorMsg(
            error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again."
          );
        }
      }
    };

    const timer = setTimeout(() => {
      handleEmailConfirmation();
    }, 500);

    return () => {
      clearTimeout(timer);
      isVerifying.current = false;
    };
  }, [params.token_hash, params.access_token, router]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemedSafeAreaView className="flex-1">
      <ScreenContainer backgroundImage={require("../../assets/images/auth-screen-bg.png")}>
        <View className="flex-1 justify-center items-center p-5">
          <View className="flex-1 items-center mb-8">
            <LogoFullIcon width={180} height={90} />
          </View>

          <Card className="rounded-xl" style={{ borderWidth: 0, backgroundColor: "transparent" }}>
            <BlurView tint="default" intensity={15} blurMethod="dimezisBlurView">
              <CardHeader className="items-center py-6">
                <View className="mb-4 h-16 w-16 items-center justify-center">
                  {status === "loading" && <Spinner />}
                  {status === "success" && <CheckmarkCircleOutlineIcon size={64} color="#22c55e" />}
                  {status === "error" && <AlertCircleOutlineIcon size={64} color="#ef4444" />}
                </View>

                <Typography variant="h2" className="text-center">
                  {status === "loading" && "Verifying your contact information"}
                  {status === "success" && "Verification Successful!"}
                  {status === "error" && "Verification Failed"}
                </Typography>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <Typography className="text-center text-base sm:text-lg">
                  {status === "loading" && "Please wait a moment..."}
                  {status === "success" &&
                    "Your contact information has been successfully verified. Redirecting to your account..."}
                  {status === "error" &&
                    (errorMsg || "There was an issue with verification. Please try again.")}
                </Typography>

                {status === "success" && (
                  <View className="mt-6">
                    <Typography variant="sm" className="text-center text-gray-600 mb-4">
                      You&apos;ll be redirected automatically in a few seconds.
                    </Typography>
                    <Button size="lg" onPress={() => router.replace("/(tabs)")} className="w-full">
                      Go to Account
                    </Button>
                  </View>
                )}
              </CardContent>
              {status === "error" && (
                <CardFooter className="pb-4">
                  <View className="flex-1 gap-4">
                    <Button
                      size="lg"
                      onPress={() => router.replace("/auth/login")}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onPress={() => router.replace("/auth/signUp")}
                      className="w-full"
                    >
                      Create New Account
                    </Button>
                  </View>
                </CardFooter>
              )}
            </BlurView>
          </Card>
        </View>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
