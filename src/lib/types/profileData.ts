export type PrimaryData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  insurant?: string;
  stateAddress?: string;
  currentInsurance?: string;
  income?: string;
  incomeExact?: string;
  state?: string;
  cityAddress?: string;
  postalCodeAddress?: string;
  streetAddress?: string;
  county?: string;
  county_code?: string;
  state_abbr?: string;
  maidenName?: string;
  dob?: string;
  gender?: string;
  usCitizen?: string;
  dentalInsurance?: string;
  tobaccoUser?: string;
  socialSecurity?: string;
  attestSSN?: boolean;
  employer?: string;
  activeAgent?: string;
  agentPUrl?: string;
};

export type MedicalData = {
  currentDoctors?: string;
  currentMedications?: string;
  scheduledProcedures?: string;
  procedureType?: string;
  doctorName?: string;
  doctorPhoneNumber?: string;
  doctorStreetAddress?: string;
  doctorCityAddress?: string;
  doctorStateAddress?: string;
  doctorPostalCode?: string;
  lowestPremium?: string;
  medicationNames?: string;
  weightLoss?: string;
  hairLossTreatments?: string;
  erectileDysfunctionTreatments?: string;
  hormoneReplacementTherapy?: string;
  testosteroneReplacementTherapy?: string;
  anti_aging?: string;
};

export type SpouseData = {
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  dob?: string;
  gender?: string;
  usCitizen?: string;
  tobaccoUser?: string;
  socialSecurity?: string;
  attestSSN?: boolean;
  employer?: string;
  coverage?: string;
};

export type DependentData = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  relationship?: string;
  dob?: string;
  socialSecurity?: string;
  needsCoverage?: string;
};

export type PlanData = {
  effective_date?: string;
  carrier?: string;
  plan?: string;
  monthly_premium?: string;
  deductible?: string;
  moopdisplay?: string;
  primary_copay?: string;
  specialist_copay?: string;
  prescription_copay?: string;
  metal_level?: string;
  benefits_url?: string;
  rx_url?: string;
  doctor_url?: string;
  plan__type?: string;
  household?: string;
  assigned_agent?: string;
  retention_agent?: string;
};

export interface StatusData {
  status?: string;
  provider?: string;
  formulary?: string;
  paymentPhoneNumber?: string;
  i_consent?: string;
  workflowStage?: string;
}

export type ProfileData = {
  dependents: number | string;
  primary: PrimaryData;
  primaryMedical: MedicalData;
  spouseDetails: SpouseData;
  dependentsDetails: { items: DependentData[] };
  status: StatusData;
  statusDetails: PlanData;
};
