import { Alert } from "react-native";
import { Router } from "expo-router";

import { CardInfo } from "./CardInfo";
import {
  getContactInfo,
  getPersonalInfo,
  getMedicalInfo,
  getSpouseInfo,
  getDependentInfo,
  getPlanInfo,
} from "./cardFields";

import { View } from "@/components/ui";
import { ProfileData, DependentData } from "@/lib/types";
import { isValidDetailsObj } from "@/lib/utils";

interface ProfileInfoProps {
  profile: ProfileData;
  router: Router;
  contactId?: string;
}

export const ProfileInfo = ({ profile, router, contactId }: ProfileInfoProps) => {
  if (!profile) return null;

  const { primary, primaryMedical, spouseDetails, dependentsDetails, statusDetails } = profile;

  const allDependentsFields =
    dependentsDetails?.items?.map((dep: DependentData) => getDependentInfo(dep)) || [];

  const handleEdit = (type: string) => {
    Alert.alert("Edit Data", "Are you sure you want to edit this data from your profile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit",
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

  const handleDelete = (type: string) => {
    Alert.alert("Delete Data", "Are you sure you want to remove this data from your profile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const email = primary?.email;

          router.push({
            pathname: "/support",
            params: { email },
          });
        },
      },
    ]);
  };

  return (
    <View className="p-5">
      <CardInfo
        title="Contact Details"
        type="contact"
        fields={getContactInfo(primary)}
        onEdit={() => handleEdit("contact")}
        router={router}
      />

      <CardInfo
        title="Personal Details"
        type="personal"
        fields={getPersonalInfo(primary)}
        onEdit={() => handleEdit("personal")}
        router={router}
        contactId={contactId}
        addSpouse={!isValidDetailsObj(spouseDetails)}
        addDependent={!isValidDetailsObj(dependentsDetails)}
      />

      <CardInfo
        title="Medical Details"
        type="medical"
        fields={getMedicalInfo(primaryMedical)}
        onEdit={() => handleEdit("medical")}
        router={router}
      />

      <CardInfo
        title="Spouse Details"
        type="spouse"
        fields={getSpouseInfo(spouseDetails)}
        onEdit={() => handleEdit("spouse")}
        onDelete={() => handleDelete("rem-spouse")}
        router={router}
      />

      <CardInfo
        title="Dependents Details"
        type="dependent"
        fields={allDependentsFields}
        onEdit={() => handleEdit("dependents")}
        onDelete={() => handleDelete("rem-dependents")}
        router={router}
      />

      <CardInfo
        title="Plan Details"
        type="plan"
        fields={getPlanInfo(statusDetails)}
        onEdit={() => handleEdit("plan")}
        router={router}
      />
    </View>
  );
};
