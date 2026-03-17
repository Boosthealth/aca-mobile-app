import React from "react";
import { useRouter } from "expo-router";

import { Tag } from "./Tag";
import { getStatusStyle } from "./getStatusStyle";

import { StatusType } from "@/lib/types";
import { View, Typography, Card, CardHeader, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

const StatusErrorState = ({ message, refresh }: { message: string; refresh: () => void }) => {
  const router = useRouter();

  return (
    <Card className="mt-4 p-4">
      <CardHeader>
        <Typography variant="lg" className="text-error font-medium text-center">
          {message}
        </Typography>
        <View className="mt-4 gap-4 p-2">
          <Button variant="outline" onPress={refresh}>
            Refresh Data
          </Button>
          <Button variant="outline" onPress={() => router.push("/webview")}>
            Update Plan
          </Button>
        </View>
      </CardHeader>
    </Card>
  );
};

interface StatusProps {
  refresh: () => void;
  status?: string;
}

export const Status = ({ refresh, status }: StatusProps) => {
  const { colorScheme } = useTheme();
  const statuses: StatusType[] = [
    "Request Received",
    "Agent Processing Request",
    "More Information Needed",
    "Agent Submitted Request",
  ];

  if (status === "Cancelled") {
    return <StatusErrorState message="Your request has been cancelled." refresh={refresh} />;
  }

  const currentIndex = statuses.indexOf(status as StatusType);

  if (!status || currentIndex < 0) {
    return (
      <StatusErrorState
        message="Information on the current status of the plan is currently unavailable."
        refresh={refresh}
      />
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        {statuses.map((item, index) => {
          const { color, animation } = getStatusStyle(item, index, currentIndex);
          const isLast = index === statuses.length - 1;

          return (
            <View
              key={`status-${index}`}
              style={{ flexDirection: "row", minHeight: isLast ? 12 : 60 }}
            >
              <View style={{ alignItems: "center", width: 30 }}>
                <View className="z-10 bg-card">
                  <Tag color={color} animation={animation} />
                </View>
                {!isLast && (
                  <View
                    style={{
                      position: "absolute",
                      top: 20,
                      bottom: -10,
                      width: 1,
                      backgroundColor: Colors[colorScheme ?? "light"].mutedForeground,
                    }}
                  />
                )}
              </View>

              <View style={{ flex: 1, marginLeft: 15, paddingBottom: isLast ? 0 : 25 }}>
                <Typography
                  className={cn(index <= currentIndex ? "font-medium" : "text-muted-foreground")}
                >
                  {item}
                </Typography>

                {index === currentIndex && item === "More Information Needed" && (
                  <Typography variant="sm" className="mt-1 text-error">
                    Action required: Please check your documents.
                  </Typography>
                )}
              </View>
            </View>
          );
        })}
      </CardHeader>
    </Card>
  );
};
