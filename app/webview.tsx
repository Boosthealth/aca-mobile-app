import { WebView, WebViewNavigation } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ThemedSafeAreaView, View } from "@/components/ui";
import { LoadingScreen } from "@/screens";

const BASE_URL = "https://findyourhealthplan.vercel.app";

export default function WebviewModalScreen() {
  const router = useRouter();
  const { type, contactId } = useLocalSearchParams();

  const finalUri =
    !type || !contactId
      ? `${BASE_URL}/app-native/insurant`
      : `${BASE_URL}/native-update?type=${encodeURIComponent(String(type))}&contactId=${encodeURIComponent(String(contactId))}`;

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState?.url?.includes("/native-thank-you")) {
      router.replace({
        pathname: "/(tabs)/profile",
        params: { refresh: "true" },
      });
    }
  };

  return (
    <ThemedSafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <WebView
        source={{ uri: finalUri }}
        originWhitelist={["*"]}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={StyleSheet.absoluteFill}>
            <LoadingScreen message="Connecting to the system..." />
          </View>
        )}
        keyboardDisplayRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
