import * as Sentry from "@sentry/react-native";

import { ghlRequest } from "@/api/ghlClient";
import {
  normalizeGHLCustomFields,
  normalizeGhlContactData,
} from "@/lib/bff/normalizationGHLContactData";

export const ghlContact = async (id: string) => {
  try {
    const [customFieldsData, contactData] = await Promise.all([
      ghlRequest("/custom-fields"),
      ghlRequest(`/contacts/${id}`),
    ]);

    const customFields = customFieldsData.customFields;

    if (!customFields) {
      throw new Error("Failed to fetch custom fields from GHL API");
    }

    if (!contactData.contact) {
      throw new Error("Contact not found in GHL API");
    }

    const normalizedData = normalizeGhlContactData(contactData, customFields);

    return {
      success: true,
      data: normalizedData,
      raw: { ...contactData, customFields: normalizeGHLCustomFields(contactData, customFields) },
    };
  } catch (error) {
    Sentry.captureException(error, {
      extra: { contactId: id, source: "ghlContact" },
    });

    let errorMessage = "An unknown error occurred while loading your profile.";
    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      data: null,
      raw: null,
      error: errorMessage,
    };
  }
};
