import { SharedTypeFactory } from "../SharedTypeFactory";

export interface ApplicantInformation {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const keyMapping: Record<keyof ApplicantInformation, string | string[]> = {
  firstName: ["firstName", "first_name"],
  lastName: ["lastName", "last_name"],
  email: "email",
  phoneNumber: ["phone", "phoneNumber"],
};

class ApplicantInformationFactory extends SharedTypeFactory<ApplicantInformation> {
  protected keyMapping = keyMapping;
}

export const applicantInformationFactory = new ApplicantInformationFactory();
