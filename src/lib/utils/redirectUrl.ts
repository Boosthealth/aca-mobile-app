import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const getAuthRedirectUrl = (path: string = "auth/confirm"): string => {
  // Development with Expo Go
  if (__DEV__ && Constants.appOwnership === "expo") {
    const url = Linking.createURL(path);
    console.log("Development Redirect URL:", url);
    return url;
  }

  // Development Build (expo-dev-client)
  if (__DEV__) {
    const scheme = Constants.expoConfig?.scheme || "myapp";
    const url = `${scheme}://${path}`;
    console.log("Dev Build Redirect URL:", url);
    return url;
  }

  // Production
  const scheme = Constants.expoConfig?.scheme || "myapp";
  const url = `${scheme}://${path}`;
  return url;
};

export const logRedirectConfig = () => {
  console.log("App Configuration:", {
    isDev: __DEV__,
    platform: Platform.OS,
    appOwnership: Constants.appOwnership,
    scheme: Constants.expoConfig?.scheme,
    exampleUrl: getAuthRedirectUrl("auth/confirm"),
  });
};
