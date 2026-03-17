import { ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { LoadingScreen } from "@/screens";
import {
  ThemedSafeAreaView,
  ScreenContainer,
  View,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Pressable,
} from "@/components/ui";
import { ThemeToggle, ErrorLoadingProfile } from "@/components/modules";
import { useAppContext, useProfileContext, useTheme } from "@/providers";
import { Colors } from "@/constants";
import { AlertCircleOutlineIcon } from "@/components/icons";

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, userData, deleteAccount, isLoading: isAppLoading } = useAppContext();
  const { isLoading, error } = useProfileContext();
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme ?? "light"];
  const [showLoading, setShowLoading] = useState(false);

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

  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent. All your data will be wiped. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete My Account",
          style: "destructive",
          onPress: async () => {
            const result = await deleteAccount();
            if (result.error) {
              Alert.alert("Error", result.error);
            } else {
              router.replace("/auth/login");
            }
          },
        },
      ]
    );
  };

  if (isLoading || showLoading) {
    return <LoadingScreen />;
  }

  if (isAppLoading) {
    return <LoadingScreen message="Deleting your account..." />;
  }

  if (error) {
    return <ErrorLoadingProfile error={error} logout={() => router.back()} logoutText="Back" />;
  }

  return (
    <ThemedSafeAreaView edges={["left", "right"]} className="flex-1">
      <ScreenContainer>
        <ScrollView>
          <View className="p-5">
            <Card className="mb-6">
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="w-20 h-20 rounded-full items-center justify-center bg-secondary">
                    <Typography variant="h3" className="font-bold">
                      {userData?.first_name?.[0] || "?"}
                      {userData?.last_name?.[0] || "?"}
                    </Typography>
                  </View>
                  <View className="items-end gap-1">
                    <Typography className="opacity-70">
                      {userData?.first_name} {userData?.last_name}
                    </Typography>
                    <Typography className="opacity-70">{userData?.email}</Typography>
                    <Typography className="opacity-70">{userData?.ghl_id}</Typography>
                  </View>
                </View>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex-row items-center justify-between">
                <Typography variant="h3">Theme</Typography>
                <ThemeToggle />
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="lg" onPress={handleLogout}>
                  Log out
                </Button>
              </CardContent>
            </Card>

            <View className="mb-4">
              <Typography variant="h3" className="text-error">
                Delete Account
              </Typography>
              <Typography variant="sm">
                Permanently delete your account and all associated data.
              </Typography>
            </View>
            <Card style={{ borderColor: theme.error }}>
              <CardHeader>
                <View className="flex-row items-start gap-2">
                  <AlertCircleOutlineIcon size={24} color={theme.error} />
                  <View>
                    <Typography variant="lg" className="font-semibold">
                      Warning
                    </Typography>
                    <Typography variant="sm">
                      This action is irreversible. All your data will be permanently deleted.
                    </Typography>
                  </View>
                </View>
              </CardHeader>
              <CardContent>
                <Pressable
                  onPress={handleDelete}
                  className="p-3 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: theme.error }}
                >
                  <Typography variant="lg" className="font-semibold" style={{ color: theme.white }}>
                    Delete My Account
                  </Typography>
                </Pressable>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
