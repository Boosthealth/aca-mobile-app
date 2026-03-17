import { maskSSN } from "@/lib/utils";
import { PrimaryData, MedicalData, SpouseData, DependentData, PlanData } from "@/lib/types";

export interface AccountFieldItem {
  label: string;
  value: string | number;
  descr?: string;
}

export const getContactInfo = (data: PrimaryData): AccountFieldItem[] => {
  return [
    { label: "Email", value: data?.email || "" },
    { label: "Phone number", value: data?.phoneNumber || "" },
    { label: "Street address", value: data?.streetAddress || "" },
    { label: "City", value: data?.cityAddress || "" },
    {
      label: "State",
      value: data?.state ? data.state.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase()) : "",
    },
    { label: "Postal code", value: data?.postalCodeAddress || "" },
  ];
};

export const getPersonalInfo = (data: PrimaryData): AccountFieldItem[] => {
  const monthlyIncome = data?.incomeExact
    ? Number(String(data.incomeExact).replace(/[^0-9.]/g, ""))
    : "";
  const annualIncome = monthlyIncome ? monthlyIncome * 12 : "";

  return [
    { label: "First name", value: data?.firstName || "" },
    { label: "Last name", value: data?.lastName || "" },
    { label: "Maiden name", value: data?.maidenName || "" },
    { label: "Date of birth", value: data?.dob || "" },
    {
      label: "Gender",
      value: data?.gender?.replace(/\b\w/g, (m) => m.toUpperCase()) || "",
    },
    {
      label: "United States citizen",
      value: data?.usCitizen?.replace(/\b\w/g, (m) => m.toUpperCase()) || "",
    },
    { label: "Monthly Income", value: `$${monthlyIncome}` },
    {
      label: "Annual Income",
      value: `$${annualIncome}`,
    },
    {
      label: "Social Security number",
      value: data?.socialSecurity ? maskSSN(data.socialSecurity) : "",
    },
    { label: "Most recent employer", value: data?.employer || "" },
  ];
};

export const getMedicalInfo = (data: MedicalData): AccountFieldItem[] => {
  return [
    {
      label: "Doctors / Specialist / Providers to remain in Network",
      value: (data && data.currentDoctors?.replace(/\b\w/g, (m) => m.toUpperCase())) || "",
    },
    {
      label: "Doctor's name",
      value: (data && data.doctorName) || "",
    },
    {
      label: "Doctor's street address",
      value: (data && data.doctorStreetAddress) || "",
    },
    {
      label: "Doctor's city",
      value: (data && data.doctorCityAddress) || "",
    },
    {
      label: "Doctor's state",
      value: (data && data.doctorStateAddress) || "",
    },
    {
      label: "Doctor's postal code",
      value: (data && data.doctorPostalCode) || "",
    },
    {
      label: "Doctor's phone number",
      value: (data && data.doctorPhoneNumber) || "",
    },
    {
      label: "Prescription medications",
      value: (data && data.medicationNames) || "",
    },
    {
      label: "Scheduled surgeries / procedures",
      value: (data && data.scheduledProcedures?.replace(/\b\w/g, (m) => m.toUpperCase())) || "",
    },
    {
      label: "If your doctor is not part of the $0 plan network",
      value: (data && data.lowestPremium) || "",
    },
    {
      label: "Weight Loss (GLP-1 medications)",
      value: data && data.weightLoss ? "Get information" : "",
    },
    {
      label: "Hair Loss Treatments",
      value: data && data.hairLossTreatments ? "Get information" : "",
    },
    {
      label: "Erectile Dysfunction (ED) Treatments",
      value: data && data.erectileDysfunctionTreatments ? "Get information" : "",
    },
    {
      label: "Hormone Replacement Therapy (HRT)",
      value: data && data.hormoneReplacementTherapy ? "Get information" : "",
    },
    {
      label: "Testosterone Replacement Therapy (TRT)",
      value: data && data.testosteroneReplacementTherapy ? "Get information" : "",
    },
    {
      label: "Anti-Aging",
      value: data && data.anti_aging ? "Get information" : "",
    },
  ];
};

export const getSpouseInfo = (data: SpouseData): AccountFieldItem[] => {
  return [
    {
      label: "First name",
      value: (data && data.firstName) || "",
    },
    {
      label: "Last name",
      value: (data && data.lastName) || "",
    },
    {
      label: "Maiden name",
      value: (data && data.maidenName) || "",
    },
    {
      label: "Date of birth",
      value: (data && data.dob) || "",
    },
    {
      label: "Gender",
      value: (data && data?.gender && data.gender.replace(/\b\w/g, (m) => m.toUpperCase())) || "",
    },
    {
      label: "United States citizen",
      value:
        (data && data?.usCitizen && data.usCitizen.replace(/\b\w/g, (m) => m.toUpperCase())) || "",
    },
    {
      label: "Tobacco user",
      value:
        (data && data?.tobaccoUser && data.tobaccoUser.replace(/\b\w/g, (m) => m.toUpperCase())) ||
        "",
    },
    {
      label: "Social Security number",
      value: data && data.socialSecurity ? maskSSN(data.socialSecurity) : "",
    },
    {
      label: "Most recent employer",
      value: (data && data.employer) || "",
    },
    {
      label: "Spouse coverage",
      value: (data && data.coverage) || "",
    },
  ];
};

export const getDependentInfo = (data: DependentData): AccountFieldItem[] => {
  return [
    {
      label: "First name",
      value: (data && data.firstName) || "",
    },
    {
      label: "Last name",
      value: (data && data.lastName) || "",
    },
    {
      label: "Date of birth",
      value: (data && data.dob) || "",
    },
    {
      label: "Gender",
      value: (data && data.gender && data.gender.replace(/\b\w/g, (m) => m.toUpperCase())) || "",
    },
    {
      label: "Social Security number",
      value: data && data.socialSecurity ? maskSSN(data.socialSecurity) : "N/A",
    },
    {
      label: "Relationship",
      value: (data && data.relationship?.replace(/\b\w/g, (m) => m.toUpperCase())) || "",
    },
    {
      label: "This person needs coverage",
      value: data?.needsCoverage === "true" ? "Yes" : "No",
    },
  ];
};

export const getPlanInfo = (data: PlanData): AccountFieldItem[] => {
  return [
    {
      label: "Anticipated Effective Date",
      value: data?.effective_date || "Pending",
      descr: "The date your insurance plan is expected to start.",
    },
    {
      label: "Carrier",
      value: data?.carrier || "Pending",
    },
    {
      label: "Plan",
      value: data?.plan || "Pending",
    },
    {
      label: "Monthly Premium",
      value: data?.monthly_premium ? `$${data?.monthly_premium}` : "Pending",
      descr:
        "The amount you pay each month to have health insurance, even if you don’t use any medical services.",
    },
    {
      label: "Deductible",
      value: data?.deductible ? `$${data?.deductible}` : "Pending",
      descr:
        "The amount you pay out of pocket each year before your insurance starts covering most services.",
    },
    {
      label: "Out-of-pocket max",
      value: data?.moopdisplay ? `$${data?.moopdisplay}` : "Pending",
      descr:
        "The most you’ll pay in a year for covered healthcare. After you hit this number, insurance pays 100%.",
    },
    {
      label: "Primary Care Copay",
      value: data?.primary_copay || "Pending",
      descr: "A fixed amount you pay for a regular doctor visit.",
    },
    {
      label: "Specialist Care Copay",
      value: data?.specialist_copay || "Pending",
      descr: "A fixed amount you pay to see a specialist, like a dermatologist or cardiologist.",
    },
    {
      label: "Prescription Copay",
      value: data?.prescription_copay || "Pending",
      descr: "The set amount you pay for prescription drugs.",
    },
    {
      label: "Metal Level",
      value: data?.metal_level || "Pending",
    },
    {
      label: "Summary of Benefits URL",
      value: data?.benefits_url || "Pending",
      descr:
        "A web link to a document showing what’s covered, what you pay, and how the plan works.",
    },
    {
      label: "RX URL",
      value: data?.rx_url || "Pending",
      descr: "A link that shows which medications are covered and their cost. Doctor Network URL",
    },
    {
      label: "Doctor Network URL",
      value: data?.doctor_url || "Pending",
      descr: "A link to search for doctors and providers in the insurance company’s network.",
    },
    {
      label: "Plan Type",
      value: data?.plan__type || "Pending",
    },
    {
      label: "Household Size",
      value: data?.household || "Pending",
    },
    {
      label: "Assigned Agent",
      value: data?.assigned_agent || "Pending",
      descr: "The licensed insurance person who helped you choose or enroll in your plan.",
    },
    {
      label: "Assigned Customer Service Agent",
      value: data?.retention_agent || "Pending",
      descr:
        "An individual assigned to your file who can help with questions or problems after you sign up.",
    },
  ];
};
