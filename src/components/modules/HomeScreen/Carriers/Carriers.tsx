import { useEffect } from "react";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

import { View, Typography } from "@/components/ui";

interface CarrierLogo {
  id: string;
  name: string;
  source: any;
  width: number;
  height: number;
}

const carriers: CarrierLogo[] = [
  {
    id: "ambetter",
    name: "Ambetter",
    source: require("@assets/images/logos/carriers/ambetterLogo.svg"),
    width: 105,
    height: 110,
  },
  {
    id: "bluecross",
    name: "Blue Cross",
    source: require("@assets/images/logos/carriers/BlueCross.svg"),
    width: 105,
    height: 110,
  },
  {
    id: "cigna",
    name: "Cigna",
    source: require("@assets/images/logos/carriers/cignaLogo.webp"),
    width: 105,
    height: 110,
  },
  {
    id: "humana",
    name: "Humana",
    source: require("@assets/images/logos/carriers/humanaLogo.webp"),
    width: 105,
    height: 110,
  },
  {
    id: "anthem",
    name: "Anthem",
    source: require("@assets/images/logos/carriers/anthemLogo.webp"),
    width: 105,
    height: 110,
  },
  {
    id: "brighthealth",
    name: "Bright Health Care",
    source: require("@assets/images/logos/carriers/brightHealthLogo.webp"),
    width: 105,
    height: 110,
  },
];

// Duplicate carriers for seamless loop
const duplicatedCarriers = [...carriers, ...carriers, ...carriers];

export default function Carriers() {
  const translateX = useSharedValue(0);

  // Calculate total width: each logo container is 150px width + 16px gap
  const itemWidth = 166; // 150px + 16px gap
  const totalWidth = carriers.length * itemWidth;

  useEffect(() => {
    // Animate from 0 to -totalWidth to create seamless loop
    translateX.value = withRepeat(
      withTiming(-totalWidth, {
        duration: 25000, // 25 seconds for smooth scroll
        easing: Easing.linear,
      }),
      -1, // infinite repeat
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [totalWidth]); //eslint-disable-line react-hooks/exhaustive-deps

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View className="items-center gap-6 py-5 my-5 bg-gradient-to-br from-secondary to-[#af4000]">
      <Typography variant="h2" className="text-center font-extrabold">
        Carriers We Represent
      </Typography>

      {/* Marquee Container */}
      <View className="w-full">
        <Animated.View style={[{ flexDirection: "row", gap: 16 }, animatedStyle]}>
          {duplicatedCarriers.map((carrier, index) => (
            <View
              key={`${carrier.id}-${index}`}
              className="h-[80px] w-[150px] items-center justify-center bg-white shadow-neutral-500 shadow-md rounded-xl px-4"
            >
              <Image
                source={carrier.source}
                style={{
                  width: carrier.width,
                  height: carrier.height,
                }}
                contentFit="contain"
                accessibilityLabel={`${carrier.name} logo`}
              />
            </View>
          ))}
        </Animated.View>
      </View>

      <Typography className="text-center font-medium">... And Many More!</Typography>
    </View>
  );
}
