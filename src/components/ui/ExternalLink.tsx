import { Href, Link } from "expo-router";
import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";
import { cssInterop } from "nativewind";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function ExternalLinkComponent({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as Href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          event.preventDefault();
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}

export const ExternalLink = cssInterop(ExternalLinkComponent, {
  className: "style",
});
