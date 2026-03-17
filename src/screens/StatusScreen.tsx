import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { LoadingScreen } from "./LoadingScreen";

import { ScreenContainer, ThemedSafeAreaView, View, Typography } from "@/components/ui";
import { LogoFullIcon } from "@/components/icons";
import { ErrorLoadingProfile, StatusBlock } from "@/components/modules";
import { useAppContext, useProfileContext } from "@/providers";

export function StatusScreen() {
  const router = useRouter();
  const { user, userData } = useAppContext();
  const { profile, isLoading, fetchProfile, error } = useProfileContext();
  const [showLoading, setShowLoading] = useState(false);

  // Load the profile when entering the screen
  const ghlId = userData?.ghl_id;

  useEffect(() => {
    if (ghlId && !profile) {
      fetchProfile(ghlId);
    }
  }, [ghlId, profile, fetchProfile]);

  const handleRefreshProfile = async () => {
    setShowLoading(true);
    if (user && userData) await fetchProfile(userData.ghl_id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowLoading(false);
  };

  if (isLoading || showLoading) {
    return <LoadingScreen />;
  }

  if (error && !profile) {
    return (
      <ErrorLoadingProfile
        error={error}
        refresh={handleRefreshProfile}
        logout={() => router.back()}
        logoutText="Back"
      />
    );
  }

  if (!profile) {
    return (
      <ErrorLoadingProfile
        refresh={handleRefreshProfile}
        logout={() => router.back()}
        logoutText="Back"
      />
    );
  }

  return (
    <ThemedSafeAreaView className="flex-1">
      <ScreenContainer>
        <ScrollView>
          <View className="flex-1 p-5 pt-2">
            <View className="items-center mb-2">
              <LogoFullIcon width={120} height={60} />
            </View>
            <Typography variant="h2" className="text-center">
              Thank you for your health insurance request!
            </Typography>
            <Typography className="text-center">
              We appreciate your trust in us and have started processing your request. You can track
              its progress right here on this page. Have any questions or need help? Just click the
              chat button in the bottom-right corner to connect with our friendly customer service
              team.
            </Typography>

            <StatusBlock
              status={profile?.status?.status || "Cancelled"}
              refresh={handleRefreshProfile}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
