import { useState, useMemo, useCallback } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LayoutChangeEvent } from "react-native";

import { ChevronUpIcon, ChevronDownIcon, QuestionCircleIcon } from "@/components/icons";
import { useThemeColor } from "@/hooks";
import { Typography, View, Pressable } from "@/components/ui";

interface FAQItem {
  id: string;
  question: string;
  answer: string[];
}

const faqData: FAQItem[] = [
  {
    id: "0",
    question: "What is a $0 premium policy?",
    answer: [
      "With a $0 premium policy, there is nothing to pay on a monthly basis. Zero-premium plans are offered to you through one of our trusted private insurance company partners.",
      "To keep costs low, the federal government contracts with private insurance companies and pays them a flat fee. The insurance company then creates agreements with a network of local hospitals or providers, which makes it more affordable for you.",
    ],
  },
  {
    id: "1",
    question: "Am I eligible for a $0 premium policy?",
    answer: [
      "4 out of 5 applicants are eligible for a $0 premium policy and 80% of customers will pay no more than $10 per month. Eligibility depends on the combination of a number of factors including your age, income, and location.",
      "But don't worry - we will determine your eligibility based on the answers provided in your form. If you aren't eligible for a $0 premium policy, we will find you the best value option for your needs.",
    ],
  },
  {
    id: "2",
    question: "Does it include dental?",
    answer: [
      "The majority of policies also include routine and emergency dental care. Where this is not offered as standard, it can usually be purchased as an add-on.",
    ],
  },
  {
    id: "3",
    question: "Will I be covered for pre-existing medical conditions?",
    answer: ["Yes. Pre-existing conditions do not disqualify eligibility."],
  },
  {
    id: "4",
    question: "When will I need to pay for medical care?",
    answer: [
      "There will often be some costs to pay when you access medical care. These include deductibles, coinsurance, and/or copays and represent the share you pay out of your own pocket when you receive care.",
      "These costs will be clearly outlined in your policy documents and your carrier will be happy to clarify any queries.",
    ],
  },
];

interface AccordionItemProps {
  item: FAQItem;
  isActive: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

function AccordionItem({ item, isActive, onToggle, isLast }: AccordionItemProps) {
  const heightAnim = useSharedValue(0);
  const progress = useSharedValue(isActive ? 1 : 0);
  const [measured, setMeasured] = useState(false);

  const secondaryColor = useThemeColor({}, "secondary");
  const borderColor = useThemeColor({}, "border");
  const bgColor = useThemeColor({}, "background");

  // Measure content only once
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height > 0 && !measured) {
        heightAnim.value = height;
        setMeasured(true);
      }
    },
    [measured, heightAnim]
  );

  // Update animation when isActive changes
  useMemo(() => {
    if (measured) {
      progress.value = withTiming(isActive ? 1 : 0, {
        duration: 250,
      });
    }
  }, [isActive, measured, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      height: progress.value * heightAnim.value,
      opacity: progress.value,
    };
  }, []);

  return (
    <View className="py-3" style={{ borderColor, borderBottomWidth: !isLast ? 1 : 0 }}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`Toggle answer for: ${item.question}`}
      >
        <View
          className="flex items-center gap-2 pr-2"
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="p" className="flex-1 text-base font-medium text-foreground">
            {item.question}
          </Typography>
          {isActive ? (
            <ChevronUpIcon size={24} color={secondaryColor} />
          ) : (
            <ChevronDownIcon size={24} color={secondaryColor} />
          )}
        </View>
      </Pressable>

      <Animated.View style={[animatedStyle, { overflow: "hidden" }]}>
        <View
          onLayout={handleLayout}
          className="gap-2 pt-2 pb-3"
          style={{ backgroundColor: bgColor, position: "absolute", opacity: 0 }}
        >
          {item.answer.map((paragraph, index) => (
            <Typography variant="p" key={index} className="text-sm text-foreground">
              {paragraph}
            </Typography>
          ))}
        </View>

        <View className="gap-2 pt-2 pb-3" style={{ backgroundColor: bgColor }}>
          {item.answer.map((paragraph, index) => (
            <Typography variant="p" key={index} className="text-sm text-foreground">
              {paragraph}
            </Typography>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

export default function FAQ() {
  const [activeId, setActiveId] = useState("0");
  const secondaryColor = useThemeColor({}, "secondary");

  const handleToggle = useCallback((id: string) => {
    setActiveId((current) => (current === id ? "" : id));
  }, []);

  return (
    <View className="p-5">
      <View className="flex-row items-center justify-between pr-2">
        <Typography variant="h2" className="font-extrabold">
          Need more information?
        </Typography>
        <QuestionCircleIcon size={24} color={secondaryColor} />
      </View>

      <Typography className="text-sm">Frequently Asked Questions</Typography>

      {faqData.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={activeId === item.id}
          onToggle={() => handleToggle(item.id)}
          isLast={index === faqData.length - 1}
        />
      ))}
    </View>
  );
}
