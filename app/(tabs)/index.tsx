import { ScrollView } from "react-native";

import { ScreenContainer, ThemedSafeAreaView } from "@/components/ui";
import { Carriers, FAQ, Hero, HomeHeader, WhyChooseUs, Status } from "@/components/modules";

export default function HomeScreen() {
  return (
    <ThemedSafeAreaView className="flex-1">
      <ScreenContainer>
        <ScrollView stickyHeaderIndices={[0]}>
          <HomeHeader />
          <Hero />
          <Status />
          <WhyChooseUs />
          <Carriers />
          <FAQ />
        </ScrollView>
      </ScreenContainer>
    </ThemedSafeAreaView>
  );
}
