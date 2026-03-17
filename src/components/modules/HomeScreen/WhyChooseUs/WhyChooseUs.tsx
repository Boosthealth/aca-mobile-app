import { Image } from "expo-image";

import { Typography, View, Card } from "@/components/ui";

const pros = [
  {
    id: "why-choose-us-0",
    title: "4 out of 5 households are eligible",
    description: "We are able to find $0 premium policies for the majority of clients.",
    preview: require("@assets/images/testimonal-1.png"),
  },
  {
    id: "why-choose-us-1",
    title: "Don’t overpay for health insurance",
    description:
      "We’ll find you affordable health insurance that could save your life, allow for preventative treatments and manage any health issues year-round.",
    preview: require("@assets/images/testimonal-2.png"),
  },
  {
    id: "why-choose-us-2",
    title: "No need to talk on the phone",
    description:
      "The form is 100% online. We will only contact you by text or email if we need any additional information.",
    preview: require("@assets/images/testimonal-3.png"),
  },
];

export default function WhyChooseUs() {
  return (
    <View className="mt-2 p-5 gap-1">
      <Typography variant="h2" className="font-extrabold text-blue-foreground tracking-tight">
        Why Choose Us
      </Typography>
      <Typography variant="p" className="text-base">
        Expert Guidance, Tailored Solutions
      </Typography>

      <View className="gap-4 mt-2">
        {pros.map(({ id, description, title, preview }) => (
          <Card key={id} className="p-5 pl-4">
            <View className="flex-row gap-3 items-start">
              <Image source={preview} style={{ width: 64, height: 64 }} />

              <View className="flex-1 gap-2">
                <Typography variant="h3" className="text-lg font-bold leading-6">
                  {title}
                </Typography>
                <Typography variant="p" className="text-sm">
                  {description}
                </Typography>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
