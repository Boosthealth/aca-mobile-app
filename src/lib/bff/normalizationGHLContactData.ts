import { parseISO, format } from "date-fns";

import { CustomField } from "../types";
import { formatPhone } from "../utils";

const primaryUserDataMap: Record<string, string> = {
  "contact.who_is_looking_for_coverage__text": "insurant",
  "contact.state": "stateAddress",
  "contact.currentinsurance": "currentInsurance",
  "contact.income": "income",
  "contact.incomeexact": "incomeExact",
  "contact.stateconsolidated": "state",
  "contact.primary__cityaddress": "cityAddress",
  "contact.primary__postalcodeaddress": "postalCodeAddress",
  "contact.primary__streetaddress": "streetAddress",
  "contact.primary__countyaddress": "county",
  "contact.selectedcountyobj__county_code": "county_code",
  "contact.selectedcountyobj__state_abbr": "state_abbr",
  "contact.maiden_name": "maidenName",
  "contact.primary__dob": "dob",
  "contact.primary__gender": "gender",
  "contact.primary__uscitizen": "usCitizen",
  "contact.primary__dentalinsurance": "dentalInsurance",
  "contact.primary__tobaccouser": "tobaccoUser",
  "contact.ssn__text": "socialSecurity",
  "contact.isattestssnrequired": "attestSSN",
  "contact.primary__employer": "employer",
  "contact.active_agent": "activeAgent",
  "contact.agent_purl": "agentPUrl",
};

const primaryMedicalUserDataMap: Record<string, string> = {
  "contact.primarymedical__currentdoctors": "currentDoctors",
  "contact.primarymedical__currentmedications": "currentMedications",
  "contact.primarymedical__scheduledprocedures": "scheduledProcedures",
  "contact.doctor_name": "doctorName",
  "contact.phone": "doctorPhoneNumber",
  "contact.doctor_street": "doctorStreetAddress",
  "contact.doctor_city": "doctorCityAddress",
  "contact.doctor_state": "doctorStateAddress",
  "contact.doctor_postal_code": "doctorPostalCode",
  "contact.procedure_type": "procedureType",
  "contact.medication_names": "medicationNames",
  "contact.lowest_premium": "lowestPremium",
  "contact.weightLoss": "weightLoss",
  "contact.hairLossTreatments": "hairLossTreatments",
  "contact.erectileDysfunctionTreatments": "erectileDysfunctionTreatments",
  "contact.hormoneReplacementTherapy": "hormoneReplacementTherapy",
  "contact.testosteroneReplacementTherapy": "testosteroneReplacementTherapy",
  "contact.anti_aging": "anti_aging",
};

const spouseUserDataMap: Record<string, string> = {
  "contact.spouse_first_name": "firstName",
  "contact.spouse_last_name": "lastName",
  "contact.spouse_maiden_name": "maidenName",
  "contact.spouse_date_of_birth": "dob",
  "contact.spouse_gender__text": "gender",
  "contact.spouse_is_us_citizen__text": "usCitizen",
  "contact.spouse_tobacco_user__text": "tobaccoUser",
  "contact.spouse_social_security_number__text": "socialSecurity",
  "contact.spouseattestssn": "attestSSN",
  "contact.name_of_employer_for_spouse": "employer",
  "contact.does_spouse_need_coverage__text": "coverage",
};

const userStatusUpdateDataMap: Record<string, string> = {
  "contact.policy_status": "status",
  "contact.network_url": "provider",
  "contact.formulary_url": "formulary",
  "contact.mfghs_payment_phone_number": "paymentPhoneNumber",
  "contact.cc_workflow_stage": "workflowStage",
  "contact.renewed": "renewed",
};

const userStatusDetailsDataMap: Record<string, string> = {
  "contact.effective_date": "effective_date",
  "contact.selectedplan__issuer__name": "carrier",
  "contact.selectedplan__name": "plan",
  "contact.selectedplan__premium_w_credit": "monthly_premium",
  "contact.selectedplan__deductibledisplay": "deductible",
  "contact.selectedplan__moopdisplay": "moopdisplay",
  "contact.selectedplan__pcpcopaydisplay": "primary_copay",
  "contact.selectedplan__specialistcopaydisplay": "specialist_copay",
  "contact.selectedplan__prescriptioncopaydisplay": "prescription_copay",
  "contact.selectedplan__metal_level": "metal_level",
  "contact.selectedplan__benefits_url": "benefits_url",
  "contact.formulary_url": "rx_url",
  "contact.network_url": "doctor_url",
  "contact.selectedplan__type": "plan__type",
  "contact.how_many_people_need_coverage": "household",
  "contact.original_assigned_agent": "assigned_agent",
  "contact.original_retention_agent": "retention_agent",
};

const userStatusFinishPlanDataMap: Record<string, string> = {
  "contact.hs_resume_link": "link",
  "contact.converted_yesno": "converted",
};

const userStatusSmsOptDataMap: Record<string, string> = {
  "contact.sms_account_notifications": "sms_account_notifications",
  "contact.sms_customer_care": "sms_customer_care",
  "contact.sms_marketing_messages": "sms_marketing_messages",
};

/**
 * Normalizes a value received from the API for SMS options.
 *
 * Logic:
 * - If the value is empty (`""`, `null`, `undefined`) → return an empty string
 *   (meaning the user has not made a choice).
 * - Otherwise, convert the value to a string and check if it equals `"true"`.
 *   - `"true"` → `true`
 *   - any other value → `false`
 *
 * The result is always either `""` or a boolean.
 *
 * @param value The value from the API (string, boolean, null, or undefined).
 * @returns "" | boolean
 */
function normalizeSmsOpt(value: any): "" | boolean {
  if (value === "" || value === null || value === undefined) return "";
  return String(value).toLowerCase() === "true";
}

const assignFields = (fieldsMap: Record<string, any>, source: Record<string, any>) => {
  let output: Record<string, any> = {};

  Object.keys(fieldsMap).forEach((key) => {
    switch (fieldsMap[key]) {
      case "socialSecurity":
        output[fieldsMap[key]] = source[key] ? source[key].replaceAll(/\-|\ /gm, "") : "";
        break;
      default:
        output[fieldsMap[key]] = source[key] || "";
        break;
    }
  });

  return output;
};

/**
 * The normalizeGHLCustomFields function is a utility designed
 * to transform and map custom field data from a GoHighLevel (GHL) contact object
 * into a more usable format for your application.
 * @param data - GHL API Contact object
 * @param customFields - an array of custom field definitions (typically fetched from the GHL API).
 * @returns the output object, which contains all the mapped custom fields for the contact.
 */
export const normalizeGHLCustomFields = (
  data: Record<string, any>,
  customFields: CustomField[]
) => {
  let output: Record<string, any> = {};

  const { contact } = data;

  contact.customField.forEach(({ id, value }: { id: string; value: any }) => {
    // The `field` variable assignment in the normalizeGhlContactData function
    // is used to map custom fields from the contact.customField array
    // to their corresponding keys in the customFields array.
    // * `goHighLevelCustomFields` is an array of custom fields saved in the local database
    // * `customFields` is an array of custom fields from the GHL API (https://rest.gohighlevel.com/v1/custom-fields)

    // const field = goHighLevelCustomFields.find(f => f.id === id);
    const field = customFields.find((f) => f.id === id);
    output[field?.fieldKey || id] = value;
  });

  return output;
};

export const normalizeGhlContactData = (data: Record<string, any>, customFields: CustomField[]) => {
  let details: Record<string, any> = normalizeGHLCustomFields(data, customFields);
  let output: Record<string, any> = {};
  let primary: Record<string, any> = {};
  let primaryMedical: Record<string, any> = {};
  let spouseDetails: Record<string, any> = {};
  let dependentsDetails: Record<string, any> = {};
  let dependentsItems: Record<string, string>[] = [];
  let statusUpdate: Record<string, any> = {};
  let statusDetails: Record<string, any> = {};
  let statusFinishPlan: Record<string, any> = {};
  let smsOpt: Record<string, any> = {};

  const { contact } = data;
  const { dndSettings = null } = contact;

  primary = assignFields(primaryUserDataMap, details);
  primary["firstName"] = contact?.firstName || "";
  primary["lastName"] = contact?.lastName || "";
  primary["email"] = contact?.email || "";
  primary["phoneNumber"] = contact?.phone ? formatPhone(contact.phone) : "";
  primary["city"] = contact.city || "";
  primary["stateAddress"] = contact.state ? contact.state.toLowerCase() : "";
  primary["state"] = contact.state ? contact.state.toLowerCase() : "";
  primary["attestSSN"] = ["", undefined].includes(primary.attestSSN)
    ? undefined
    : primary.attestSSN === "true";

  primaryMedical = assignFields(primaryMedicalUserDataMap, details);
  spouseDetails = assignFields(spouseUserDataMap, details);

  Array.from(Array(10).keys()).forEach((i) => {
    let dependent: Record<string, string> = {};

    const dependentFieldsMap: Record<string, string> = {
      [`contact.dep${i + 1}firstname`]: "firstName",
      [`contact.dep${i + 1}lastname`]: "lastName",
      [`contact.dep${i + 1}relationship`]: "relationship",
      [`contact.dep${i + 1}dob`]: "dob",
      [`contact.dep${i + 1}socialsecurity`]: "socialSecurity",
      [`contact.dep${i + 1}gender`]: "gender",
      [`contact.dep${i + 1}coverage`]: "needsCoverage",
    };

    Object.keys(dependentFieldsMap).forEach((key) => {
      if (details[key]) {
        switch (dependentFieldsMap[key]) {
          case "socialSecurity":
            dependent[dependentFieldsMap[key]] = details[key]
              ? details[key].replaceAll(/\-|\ /gm, "")
              : "";
            break;
          case "dob":
            const dobValue = details[key];
            const mmddyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (mmddyyyyRegex.test(dobValue)) {
              dependent.dob = dobValue;
            } else {
              try {
                const parsedDate = parseISO(dobValue); // YYYY-MM-DD → Date
                dependent.dob = format(parsedDate, "MM/dd/yyyy");
              } catch {
                dependent.dob = dobValue; // fallback
              }
            }
            break;
          default:
            dependent[dependentFieldsMap[key]] = details[key];
            break;
        }
      }
    });
    if (Object.keys(dependent).length) {
      dependentsItems.push(dependent);
    }
  });

  const dependents = dependentsItems.length;

  if (primary && !primary.insurant) {
    const firstDependent = dependentsItems[0];

    if (!spouseDetails?.firstName && !dependents && !firstDependent?.firstName) {
      primary.insurant = "single";
    } else if (spouseDetails?.firstName && !dependents && !firstDependent?.firstName) {
      primary.insurant = "couple";
    } else if (!spouseDetails?.firstName && (Number(dependents) > 0 || firstDependent?.firstName)) {
      primary.insurant = "single-parent";
    } else if (spouseDetails?.firstName && (Number(dependents) > 0 || firstDependent?.firstName)) {
      primary.insurant = "family";
    }
    // Not quite sure about (Number(dependents) > 0 || firstDependent?.firstName)).
    // if there is a case where there are dependents but they don't need coverage - my thoughts go to that name "how_many_dependents_kids_need_coverage"
  }

  statusUpdate = assignFields(userStatusUpdateDataMap, details);
  statusUpdate["status"] = statusUpdate.status || "";
  statusUpdate["provider"] = statusUpdate.provider || "";
  statusUpdate["formulary"] = statusUpdate.formulary || "";
  statusUpdate["paymentPhoneNumber"] = statusUpdate.paymentPhoneNumber || "";
  statusUpdate["workflowStage"] = statusUpdate.workflowStage || "";
  statusUpdate["renewed"] = statusUpdate.renewed || "";

  statusDetails = assignFields(userStatusDetailsDataMap, details);

  statusFinishPlan = assignFields(userStatusFinishPlanDataMap, details);

  smsOpt = assignFields(userStatusSmsOptDataMap, details);
  smsOpt["sms_account_notifications"] = normalizeSmsOpt(smsOpt?.sms_account_notifications);
  smsOpt["sms_customer_care"] = normalizeSmsOpt(smsOpt?.sms_customer_care);
  smsOpt["sms_marketing_messages"] = normalizeSmsOpt(smsOpt?.sms_marketing_messages);

  dependentsDetails["items"] = dependentsItems;
  output["primary"] = primary;
  output["primaryMedical"] = primaryMedical;
  output["spouseDetails"] = spouseDetails;
  output["dependents"] = dependents;
  output["dependentsDetails"] = dependentsDetails;
  output["renewal"] = undefined;
  output["status"] = statusUpdate;
  output["statusDetails"] = statusDetails;
  output["statusFinishPlan"] = statusFinishPlan;
  output["smsOpt"] = smsOpt;

  // Add `dndSettings` property to normalized output data
  if (dndSettings !== null) {
    output["dndSettings"] = dndSettings;
  }

  return output;
};

export { primaryUserDataMap };
