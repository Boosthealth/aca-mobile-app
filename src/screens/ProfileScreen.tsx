import { ScrollView, Alert, RefreshControl } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { LoadingScreen } from "./LoadingScreen";

import { ThemedSafeAreaView, ScreenContainer, View, Typography } from "@/components/ui";
import { ErrorLoadingProfile, ProfileHeader, ProfileInfo } from "@/components/modules";
import { useAppContext, useProfileContext } from "@/providers";
import { useThemeColor } from "@/hooks";

export function ProfileScreen() {
  const router = useRouter();

  const { refresh } = useLocalSearchParams();

  const { logout, userData } = useAppContext();

  const { profile, isLoading, fetchProfile, error } = useProfileContext();

  const [showLoading, setShowLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const secondaryColor = useThemeColor({}, "secondary");

  // Load the profile when entering the screen
  const ghlId = userData?.ghl_id;

  useEffect(() => {
    if (ghlId && !profile && !isLoading) {
      fetchProfile(ghlId);
    }
  }, [ghlId, profile, isLoading, fetchProfile]);

  useEffect(() => {
    if (refresh === "true" && ghlId) {
      fetchProfile(ghlId);

      router.setParams({ refresh: undefined });
    }
  }, [refresh, ghlId, fetchProfile, router]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setShowLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await logout();
          setShowLoading(false);
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleRefreshProfile = async () => {
    if (!userData?.ghl_id) return;

    setRefreshing(true);
    try {
      await fetchProfile(userData.ghl_id);
    } finally {
      setRefreshing(false);
    }
  };

  if ((isLoading && !refreshing) || showLoading) {
    return <LoadingScreen />;
  }

  if (error && !profile) {
    return (
      <ErrorLoadingProfile error={error} refresh={handleRefreshProfile} logout={handleLogout} />
    );
  }

  if (!profile) {
    return <ErrorLoadingProfile refresh={handleRefreshProfile} logout={handleLogout} />;
  }

  return (
    <ThemedSafeAreaView className="flex-1">
      <ScreenContainer>
        <ScrollView
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshProfile}
              colors={[secondaryColor]}
              tintColor={secondaryColor}
            />
          }
        >
          <ProfileHeader />

          <View className="px-5 py-2">
            <Typography variant="h2" className="text-center">
              {userData?.first_name} {userData?.last_name}
            </Typography>
            <Typography variant="h3" className="text-center">
              summary information
            </Typography>
          </View>

          <ProfileInfo profile={profile} router={router} contactId={ghlId} />
        </ScrollView>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
