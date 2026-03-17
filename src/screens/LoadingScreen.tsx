import { ScreenContainer, Typography } from "@/components/ui";
import { LogoIcon, Spinner } from "@/components/icons";

type LoadingScreenProps = {
  title?: boolean;
  message?: string;
};

export function LoadingScreen({ title = true, message = "Loading..." }: LoadingScreenProps) {
  return (
    <ScreenContainer className="items-center justify-center">
      <LogoIcon key="loading-logo" className="mb-6" />
      {title && (
        <Typography key="loading-title" variant="h1" className="mb-6">
          Boost Health Insurance
        </Typography>
      )}
      {message && (
        <Typography key="loading-message" variant="p" className="mb-4">
          {message}
        </Typography>
      )}
      <Spinner key="loading-spinner" />
    </ScreenContainer>
  );
}
