import { useRouter } from "expo-router";
import { Image } from "expo-image";

import { Button, Typography, View, Card, ExternalLink } from "@/components/ui";

export default function Hero() {
  const router = useRouter();

  return (
    <View className="items-center gap-6 py-5 px-10 -mx-5 bg-gradient-to-br from-secondary/10 to-[#af4000]/15">
      <Card className="w-full p-5 pb-3 rounded-xl">
        <View className="flex-row items-start justify-between">
          <View className="w-2/3 gap-2">
            <Typography variant="h2" className="font-extrabold text-blue-foreground tracking-tight">
              You may qualify for a $0 premium health insurance plan.
            </Typography>
            <Typography variant="p" className="text-sm w-2/3">
              Start your journey to better health today!
            </Typography>
          </View>

          <ExternalLink href="https://www.trustpilot.com/review/findyourhealthplan.org?utm_medium=trustbox&utm_source=Horizontal">
            <View className="items-end gap-1">
              <View className="flex-row items-end gap-0.5">
                <Image
                  source={require("@assets/images/logos/trustpilot/star.svg")}
                  style={{ width: 24, height: 24 }}
                />
                <Typography
                  variant="lg"
                  className="font-extrabold leading-none"
                  style={{ lineHeight: 18 }}
                >
                  4.7
                </Typography>
              </View>
              <Typography variant="xs" className="font-semibold tracking-tight">
                Trustpilot
              </Typography>
            </View>
          </ExternalLink>
        </View>

        <View className="flex-row justify-end pr-2 -mt-12">
          <Image
            source={require("@assets/images/heroes-operator-2.png")}
            style={{ width: 130, height: 120 }}
          />
        </View>

        <Button onPress={() => router.push("/webview")} size="lg" className="rounded-xl">
          Check Eligibility
        </Button>

        <View className="flex-row justify-center mt-2">
          <Typography variant="xs" className="tracking-tight">
            4 Out Of 5 Of Our Customers Qualify
          </Typography>
        </View>
      </Card>
    </View>
  );
}
