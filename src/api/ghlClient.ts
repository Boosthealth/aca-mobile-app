import * as Sentry from "@sentry/react-native";

import { supabase } from "@/lib/supabase/client";

export const ghlRequest = async (endpoint: string) => {
  const { data, error } = await supabase.functions.invoke("ghl-proxy", {
    body: { endpoint },
  });

  if (error) {
    Sentry.captureException(error, {
      extra: { endpoint, source: "ghl-proxy" },
    });
    throw new Error(error.message);
  }

  if (data?.statusCode && data.statusCode >= 400) {
    const apiError = new Error(data.message || `API Error: ${data.statusCode}`);
    Sentry.captureException(apiError, {
      extra: { endpoint, statusCode: data.statusCode, source: "ghl-proxy" },
    });
    throw apiError;
  }

  return data;
};
