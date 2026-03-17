import * as Sentry from "@sentry/react-native";

import { makeFullFormFactory } from "@/lib/make";

// Map of webhook URLs based on lead type
const LEAD_URLS: Record<string, string | undefined> = {
  main: process.env.EXPO_PUBLIC_LEAD_CONNECTORHQ_URL,
  update: process.env.EXPO_PUBLIC_LEAD_UPDATE_CONNECTORHQ_URL,
};

// Make.com config
const MAKE_HOOK_URL = process.env.EXPO_PUBLIC_MAKE_HOOK_URL;
// const MAKE_HOOK_APIKEY = process.env.EXPO_PUBLIC_MAKE_HOOK_APIKEY;

const useMakeWebhook = Boolean(MAKE_HOOK_URL);

/**
 * Sends lead data via Make.com webhook
 */
const sendViaMake = async (type: "main" | "update", payload: any) => {
  const { _data, ...restPayload } = payload;
  const normalizedPayload = makeFullFormFactory.create(restPayload);

  const response = await fetch(MAKE_HOOK_URL!, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-make-apikey": MAKE_HOOK_URL!,
    },
    body: JSON.stringify(normalizedPayload),
  });

  if (!response.ok) {
    throw new Error(`Make webhook error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();

  try {
    const data = text ? JSON.parse(text) : {};
    return { success: true, data };
  } catch (parseError) {
    const responseLength = text.length;
    const responsePreview = text.slice(0, 200);
    Sentry.captureException(parseError, {
      extra: {
        type,
        source: "make",
        rawResponseLength: responseLength,
      },
    });

    console.error(`[sendViaMake]: Failed to parse JSON response`, responsePreview);
    return {
      success: false,
      error: `Server returned an invalid JSON response. ${parseError}`,
    };
  }
};

/**
 * Sends lead data via GHL/LeadConnector webhook
 * @param type - Webhook type ('main' or 'update')
 * @param payload - Data object to be sent
 */
export const sendViaGHL = async (type: "main" | "update" = "main", payload: any) => {
  const url = LEAD_URLS[type];

  if (!url) {
    const errorMsg = `Configuration for lead type "${type}" not found.`;
    Sentry.captureMessage(errorMsg, { level: "error", extra: { type, source: "ghlLead" } });
    console.error(`[submitLead]: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();

    try {
      const data = text ? JSON.parse(text) : {};
      return {
        success: true,
        data,
      };
    } catch (parseError) {
      const responseLength = text.length;
      const responsePreview = text.slice(0, 200);
      Sentry.captureException(parseError, {
        extra: {
          type,
          source: "ghlLead",
          rawResponseLength: responseLength,
        },
      });

      console.error(`[submitLead]: Failed to parse JSON response`, responsePreview);
      return {
        success: false,
        error: `Server returned an invalid JSON response. ${parseError}`,
      };
    }
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: { type, source: "ghlLead" },
    });

    console.error(`[submitLead Error]:`, error.message);
    return {
      success: false,
      error: error.message || "Failed to submit data",
    };
  }
};

/**
 * Sends lead data to GHL — via Make.com if configured, otherwise directly
 * @param type - Webhook type ('main' or 'update')
 * @param payload - Data object to be sent
 */
export const ghlLead = async (type: "main" | "update" = "main", payload: any) => {
  const source = useMakeWebhook ? "make" : "ghl";

  try {
    const result = useMakeWebhook
      ? await sendViaMake(type, payload)
      : await sendViaGHL(type, payload);

    return result;
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: { type, source },
    });

    console.error(`[submitLead Error via ${source}]:`, error.message);
    return {
      success: false,
      error: error.message || "Failed to submit data",
    };
  }
};
