# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run on web browser
npm run lint           # ESLint (expo lint)
npm run format         # Prettier format all files
npm run format:check   # Prettier check (no write)
```

No test framework is configured. No CI/CD pipeline exists.

## Environment Setup

Copy `.env.example` to `.env` and populate with real values:
- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
- `EXPO_PUBLIC_GHL_API_TOKEN` — GoHighLevel API bearer token
- `EXPO_PUBLIC_LEAD_CONNECTORHQ_URL` / `EXPO_PUBLIC_LEAD_UPDATE_CONNECTORHQ_URL` — LeadConnector webhook URLs

## Architecture

**Expo SDK 54 + React Native 0.81 + React 19** health insurance plan finder app. Targets iOS, Android, and Web. New Architecture, React Compiler, and typed routes enabled in `app.json`.

### Path Aliases

- `@/` → `src/` (source code)
- `@assets/` → `assets/` (images, icons)

Configured in both `tsconfig.json` (paths) and `babel.config.js` (module-resolver).

### Routing (`app/`)

Expo Router file-based routing with auth guards in `app/_layout.tsx`:

- `app/_layout.tsx` — Root layout: `ThemeProvider` → `AppProvider` → auth redirect logic. Unauthenticated users go to `/auth/login`, authenticated users go to `/(tabs)`.
- `app/auth/` — Login, signup, password reset, email verification (OTP + deep link), resend verification.
- `app/(tabs)/` — Three bottom tabs: Home (`index`), Status (`status`), Profile (`profile/`).
- `app/(tabs)/profile/` — Nested stack: profile screen + settings screen.
- `app/webview.tsx` — Modal that loads `findyourhealthplan.vercel.app/native-update` for editing profile sections. Intercepts navigation to `/native-thank-you` to close modal and refresh profile.

### State Management (React Context)

Three providers in `src/providers/`, nested as `ThemeProvider` → `AppProvider` → `ProfileProvider` (ProfileProvider wraps profile tab screens):

- **AppContext** — Supabase auth session, user profile from `profiles` table. Provides `login`, `signUp`, `logout`, `refreshProfile`, `resetPassword`, `resendVerification`, `deleteAccount`.
- **ProfileContext** — GHL contact data fetched via `ghlContact` service. Provides `fetchProfile`, `updateProfile`, `clearProfile`.
- **ThemeProvider** — Light/dark/system theme persisted to AsyncStorage.

### Data Flow

Two external systems:

1. **Supabase** (`src/lib/supabase/client.ts`) — Auth (email/password, email verification) and `profiles` table for user metadata including `ghl_id`.
2. **GoHighLevel REST API** (`src/api/ghlClient.ts`) — CRM contact data. Base URL: `https://rest.gohighlevel.com/v1`. Bearer token auth.

Services in `src/services/`:
- `ghlContact.ts` — Fetches `/custom-fields` + `/contacts/{id}` in parallel, normalizes via `src/lib/bff/normalizationGHLContactData.ts`.
- `ghlId.ts` — Looks up contact by email/phone via `/contacts/lookup`.
- `lead.ts` — Creates leads via LeadConnector webhooks.

Signup flow: validate form → check GHL for existing contact → create lead via webhook → poll for GHL ID → create Supabase auth user → insert `profiles` row → send verification email.

### Styling

**NativeWind (Tailwind CSS for React Native)** with `class` dark mode strategy. CSS variables defined in `global.css`, extended in `tailwind.config.js` with semantic tokens (primary, secondary, muted, accent, destructive, blue, card, flow, etc.).

`src/components/ui/Styled.tsx` exports NativeWind-interop versions of `View`, `Pressable`, `TextInput`, `ActivityIndicator`, `SafeAreaView` — use these instead of raw React Native imports when you need `className` support.

Theme colors also available programmatically via `src/constants/theme.ts` (`Colors.light`/`Colors.dark`).

### Forms

React Hook Form + Zod. Schemas in `src/schemas/` with shared validators (email, password, phone, name). Form components in `src/components/ui/Form.tsx` (`<Form>`, `<FormField>`, `<FormItem>`, `<FormMessage>`). Pattern:

```tsx
const form = useForm({ resolver: zodResolver(Schema) });
<Form {...form}>
  <FormField name="email" render={({ field }) => (
    <FormItem>
      <InputWithLabel {...field} />
      <FormMessage />
    </FormItem>
  )} />
</Form>
```

### Key Types (`src/lib/types/`)

- `IUserData` — Supabase `profiles` table row (user_id, ghl_id, email, phone, name).
- `ProfileData` — Normalized GHL contact: `primary`, `primaryMedical`, `spouseDetails`, `dependentsDetails` (up to 10), `status`, `statusDetails` (insurance plan).
- `SignUpData` — Signup form payload.

### Component Organization

- `src/components/ui/` — Primitives: Button (cva variants), Card, Input (animated label, phone formatting), Typography (size variants), Form, ScreenContainer.
- `src/components/modules/` — Screen-specific sections: `HomeScreen/` (Header, Hero, Status, FAQ, Carriers, WhyChooseUs), `ProfileScreen/` (Header, ProfileInfo with card fields), `StatusScreen/`, `ErrorLoadingProfile/`.
- `src/components/icons/` — Wrapper exports around Expo Vector Icons (Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons).
- `src/screens/` — Exported screen components (LoadingScreen, ProfileScreen, StatusScreen).

### Deep Linking

iOS associated domains and Android intent filters configured for `findyourhealthplan.vercel.app` and custom scheme `wfindyourhealthplanmobileapp://`. Used for email verification redirect back into the app.

## Conventions

- **TypeScript strict mode** with Expo base config
- **NativeWind className** for styling (not `StyleSheet.create`)
- **Functional components** with named exports
- **PascalCase** files for components, camelCase for utilities/services
- **Barrel exports** via `index.ts` in providers, schemas, types, screens, constants
- **ESLint** flat config extending `eslint-config-expo`
- **Prettier** with `prettier-plugin-tailwindcss` for class sorting
