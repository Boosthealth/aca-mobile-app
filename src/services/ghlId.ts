import * as Sentry from "@sentry/react-native";

import { ghlRequest } from "@/api/ghlClient";

export const ghlId = async (email?: string, rawPhone?: string) => {
  try {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = rawPhone ? `+1${rawPhone.replace(/\D/g, "")}` : "";

    if (!cleanEmail && !cleanPhone) {
      throw new Error("An email or phone number is required for the search.");
    }

    const params = new URLSearchParams();
    if (cleanEmail) params.append("email", cleanEmail);
    if (cleanPhone) params.append("phone", cleanPhone);

    const data = await ghlRequest(`/contacts/lookup?${params.toString()}`);

    if (data.contacts && data.contacts.length > 0) {
      return {
        success: true,
        contacts: data.contacts,
        error: null,
      };
    }

    return {
      success: false,
      contacts: [],
      error: "Contact not found",
    };
  } catch (error: any) {
    Sentry.captureException(error, {
      extra: { source: "ghlId" },
    });

    return {
      success: false,
      contacts: [],
      error: error.message || "Error searching for contact",
    };
  }
};
