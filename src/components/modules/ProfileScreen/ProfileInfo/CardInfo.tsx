import React from "react";
import { Alert } from "react-native";
import { Router } from "expo-router";

import {
  View,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Pressable,
  ExternalLink,
} from "@/components/ui";
import {
  EditPencilIcon,
  TrashIcon,
  InfoCircleIcon,
  ExternalLinkIcon,
  UserAddIcon,
} from "@/components/icons";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

interface CardInfoProps {
  title: string;
  type: "contact" | "personal" | "medical" | "spouse" | "dependent" | "plan";
  fields: any[];
  onEdit?: () => void;
  onDelete?: () => void;
  router: Router;
  contactId?: string;
  addSpouse?: boolean;
  addDependent?: boolean;
}

export const CardInfo = ({
  title,
  type,
  fields,
  onEdit,
  onDelete,
  router,
  contactId,
  addSpouse,
  addDependent,
}: CardInfoProps) => {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme ?? "light"];

  const hasData = (item: any) => {
    if (Array.isArray(item)) return item.some(hasData);
    return item?.value && item.value !== "" && item.value !== "N/A" && item.value !== "Pending";
  };

  if (!fields.some(hasData)) return null;

  const getLinkLabel = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("benefit")) return "View Benefits";
    if (l.includes("rx")) return "View Pharmacy";
    if (l.includes("doctor")) return "Find Doctors";
    return "View Link";
  };

  const showDescription = (label: string, descr: any) => {
    let message = "";
    if (typeof descr === "string") {
      message = descr;
    } else if (React.isValidElement(descr)) {
      message = "Check your plan documents for more details about " + label.toLowerCase();
    }

    Alert.alert(label, message || "No additional information available.");
  };

  const handleAdd = (type: string) => {
    const title = type === "add-spouse" ? "Add Spouse" : "Add Dependent";

    Alert.alert(title, "Are you sure you want to add this to your profile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add",
        style: "destructive",
        onPress: () => {
          router.push({
            pathname: "/webview",
            params: { type, contactId },
          });
        },
      },
    ]);
  };

  const renderRow = (field: any, index: number | string) => {
    const isValueMissing = !field.value || field.value === "" || field.value === "Pending";
    const displayValue = type === "plan" && isValueMissing ? "Pending" : field.value;
    const isLink = typeof field.value === "string" && /^https?:\/\//.test(field.value);

    return (
      <View key={index} className="flex-row justify-between items-start">
        <View style={{ width: "45%" }} className="flex-row items-start pr-2">
          <Typography variant="sm" className="flex-1">
            {field.label}
          </Typography>
          {field.descr && (
            <Pressable
              onPress={() => showDescription(field.label, field.descr)}
              className="mt-1 ml-1 p-0.5"
              accessibilityLabel={`More information about ${field.label}`}
            >
              <InfoCircleIcon size={14} color={theme.mutedForeground} />
            </Pressable>
          )}
        </View>
        <View className="flex-1">
          {isLink ? (
            <ExternalLink href={field.value as string}>
              <View className="flex-row items-center justify-start gap-1">
                <Typography variant="sm" className="text-blue-foreground">
                  {getLinkLabel(field.label)}
                </Typography>
                <ExternalLinkIcon size={10} color={theme.blueForeground} />
              </View>
            </ExternalLink>
          ) : (
            <Typography
              variant="sm"
              className={`break-all ${displayValue === "Pending" ? "text-muted-foreground" : ""}`}
            >
              {displayValue}
            </Typography>
          )}
        </View>
      </View>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <View className="flex-row justify-between items-center">
          <Typography variant="h3">{title}</Typography>
          {onEdit && (
            <Button variant="ghost" onPress={onEdit} className="p-0 h-auto">
              <EditPencilIcon size={18} color={theme.blueForeground} accessibilityLabel="Edit" />
            </Button>
          )}
        </View>
      </CardHeader>

      <CardContent>
        <View className="gap-2">
          {fields.map((item, index) => {
            if (Array.isArray(item)) {
              return (
                <View key={`group-${index}`} className="gap-2">
                  <Typography className="font-bold">Dependent {index + 1}</Typography>

                  {item
                    .filter((f) => f.value && f.value !== "" && f.value !== "N/A")
                    .map((field, fIndex) => renderRow(field, `${index}-${fIndex}`))}
                </View>
              );
            }

            if (type !== "plan" && !hasData(item)) return null;
            return renderRow(item, index);
          })}
        </View>
        {onDelete && (
          <View className="flex-row justify-end">
            <Button variant="ghost" className="p-0 h-auto" onPress={onDelete}>
              <View className="flex-row justify-end items-center gap-1">
                <Typography variant="sm" className="text-error">
                  Delete
                </Typography>
                <TrashIcon size={14} color={theme.error} accessibilityLabel="Delete" />
              </View>
            </Button>
          </View>
        )}
      </CardContent>
      {(addSpouse || addDependent) && (
        <CardFooter>
          <View className="flex-1 flex-row justify-end">
            {addSpouse && (
              <Button
                variant="ghost"
                className="p-0 h-auto"
                onPress={() => handleAdd("add-spouse")}
              >
                <View className="flex-row justify-end items-center gap-1">
                  <Typography variant="sm" className="text-blue-foreground">
                    Add Spouse
                  </Typography>
                  <UserAddIcon size={14} color={theme.blue} accessibilityLabel="Add Spouse" />
                </View>
              </Button>
            )}
            {addDependent && (
              <Button
                variant="ghost"
                className="p-0 h-auto"
                onPress={() => handleAdd("add-dependent")}
              >
                <View className="flex-row justify-end items-center gap-1">
                  <Typography variant="sm" className="text-blue-foreground">
                    Add Dependent
                  </Typography>
                  <UserAddIcon size={14} color={theme.blue} accessibilityLabel="Add Dependent" />
                </View>
              </Button>
            )}
          </View>
        </CardFooter>
      )}
    </Card>
  );
};
