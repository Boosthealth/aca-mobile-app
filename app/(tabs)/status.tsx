import { ProfileProvider } from "@/providers";
import { StatusScreen } from "@/screens";

export default function StatusScreenWrapper() {
  return (
    <ProfileProvider>
      <StatusScreen />
    </ProfileProvider>
  );
}
