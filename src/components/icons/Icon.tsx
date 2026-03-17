import { Ionicons, AntDesign, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ComponentPropsWithoutRef } from "react";

// List of available icons: https://icons.expo.fyi/Index

type IconWrapperProps<T extends React.ElementType> = Omit<ComponentPropsWithoutRef<T>, "name">;
type AntDesignWrapperProps<T extends React.ElementType> = Omit<ComponentPropsWithoutRef<T>, "name">;
type FontAwesome6WrapperProps<T extends React.ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  "name"
>;
type FontAwesome5WrapperProps<T extends React.ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  "name"
>;
type FontAwesomeWrapperProps<T extends React.ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  "name"
>;
type MaterialCommunityIconsWrapperProps<T extends React.ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  "name"
>;

export const HomeIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="home" {...props} />
);
export const HomeOutlineIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="home-outline" {...props} />
);
export const PersonIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="person" {...props} />
);
export const PersonOutlineIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="person-outline" {...props} />
);
export const SearchIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="search" {...props} />
);
export const SettingsIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="settings-outline" {...props} />
);
export const SpinnerIcon = (props: AntDesignWrapperProps<typeof AntDesign>) => (
  <AntDesign name="loading-3-quarters" {...props} />
);
export const ShieldIcon = (props: FontAwesome6WrapperProps<typeof FontAwesome6>) => (
  <FontAwesome6 name="shield-heart" {...props} />
);
export const ShieldOutlineIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="shield-outline" {...props} />
);
export const SunIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="sunny" {...props} />
);
export const MoonIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="moon" {...props} />
);
export const EyeIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="eye-outline" {...props} />
);
export const EyeOffIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="eye-off-outline" {...props} />
);
export const AlertCircleOutlineIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="alert-circle-outline" {...props} />
);
export const PlusIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="add" {...props} />
);
export const MinusIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="remove" {...props} />
);
export const ChevronDownIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="chevron-down" {...props} />
);
export const ChevronUpIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="chevron-up" {...props} />
);
export const QuestionCircleIcon = (props: FontAwesome6WrapperProps<typeof FontAwesome6>) => (
  <FontAwesome6 name="circle-question" {...props} />
);
export const BellIcon = (props: FontAwesome5WrapperProps<typeof FontAwesome5>) => (
  <FontAwesome5 name="bell" {...props} />
);
export const UserCircleIcon = (props: FontAwesomeWrapperProps<typeof FontAwesome>) => (
  <FontAwesome name="user-circle" {...props} />
);
export const CheckmarkCircleOutlineIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="checkmark-circle-outline" {...props} />
);
export const HouseMedicalCircleCheckIcon = (
  props: FontAwesome6WrapperProps<typeof FontAwesome6>
) => <FontAwesome6 name="house-medical-circle-check" {...props} />;
export const ShieldStarIcon = (
  props: MaterialCommunityIconsWrapperProps<typeof MaterialCommunityIcons>
) => <MaterialCommunityIcons name="shield-star" {...props} />;
export const EditPencilIcon = (props: AntDesignWrapperProps<typeof AntDesign>) => (
  <AntDesign name="edit" {...props} />
);
export const TrashIcon = (props: FontAwesome6WrapperProps<typeof FontAwesome6>) => (
  <FontAwesome6 name="trash-can" {...props} />
);
export const InfoCircleIcon = (props: IconWrapperProps<typeof Ionicons>) => (
  <Ionicons name="information-circle-outline" {...props} />
);
export const ExternalLinkIcon = (props: FontAwesomeWrapperProps<typeof FontAwesome>) => (
  <FontAwesome name="external-link" {...props} />
);
export const UserAddIcon = (props: AntDesignWrapperProps<typeof AntDesign>) => (
  <AntDesign name="user-add" {...props} />
);
export const CheckIcon = (props: AntDesignWrapperProps<typeof AntDesign>) => (
  <AntDesign name="check" {...props} />
);
