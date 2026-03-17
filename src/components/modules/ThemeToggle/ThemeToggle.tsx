import { Pressable } from "@/components/ui";
import { useThemeColor, useTheme } from "@/hooks";
import { SunIcon, MoonIcon } from "@/components/icons";

export const ThemeToggle = () => {
  const { theme, colorScheme, setTheme } = useTheme();
  const iconColor = useThemeColor({}, "secondary");

  const handleToggle = () => {
    if (theme === "system") {
      setTheme(colorScheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  const Icon = colorScheme === "dark" ? SunIcon : MoonIcon;

  return (
    <Pressable onPress={handleToggle} className="p-2">
      <Icon size={24} color={iconColor} />
    </Pressable>
  );
};
