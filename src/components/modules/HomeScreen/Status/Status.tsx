import { useRouter } from "expo-router";

import { Button, Typography, View, Card } from "@/components/ui";
import { useAppContext } from "@/providers";
import { getGreetings } from "@/lib/utils";

export default function Status() {
  const router = useRouter();
  const { userData } = useAppContext();

  return (
    <View className="p-5 pb-0">
      <Card className="p-5">
        <View className="flex-row items-end justify-between">
          <View className="gap-2 flex-1">
            <Typography variant="lg" className="font-extrabold">
              {getGreetings()}, {userData?.first_name || "User"}
            </Typography>

            <Typography variant="p" className="text-sm font-normal">
              Track your health insurance request, plan details and resources
            </Typography>
          </View>

          <Button size="sm" onPress={() => router.push("/(tabs)/profile")}>
            Details
          </Button>
        </View>
      </Card>
    </View>
  );
}
