import {
  ThemedSafeAreaView,
  ScreenContainer,
  View,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@/components/ui";
import { AlertCircleOutlineIcon } from "@/components/icons";

interface ErrorProps {
  error?: string;
  refresh?: () => void;
  logout?: () => void;
  logoutText?: string;
}

export const ErrorLoadingProfile = ({
  error,
  refresh,
  logout,
  logoutText = "Logout",
}: ErrorProps) => {
  return (
    <ThemedSafeAreaView edges={["top", "left", "right"]} className="flex-1">
      <ScreenContainer>
        <View className="flex-1 justify-center items-center p-5">
          <Card className="mb-6 w-full">
            <CardHeader>
              <View className="items-center mb-4">
                <AlertCircleOutlineIcon size={56} color="#ff0000" />
                <Typography variant="h2" className="mt-4 text-center">
                  {error ? "Error Loading Profile" : "No Profile Data"}
                </Typography>
              </View>
            </CardHeader>
            <CardContent>
              <Typography className="text-center">
                {error ? error : "Complete the insurance questionnaire to load your profile"}
              </Typography>
            </CardContent>
          </Card>
          <View className="w-full gap-4">
            {refresh && (
              <Button size="lg" onPress={refresh}>
                Try Again
              </Button>
            )}
            {logout && (
              <Button variant="outline" size="lg" onPress={logout}>
                {logoutText}
              </Button>
            )}
          </View>
        </View>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
};
