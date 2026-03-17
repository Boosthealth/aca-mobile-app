import { PayloadFactory } from "./PayloadFactory";
import { ApplicantInformation, applicantInformationFactory } from "./shared/ApplicantInformation";

type MakeMobileSignUp = {
  payloadCategory: string;
  eventDate: string;
  applicantInformation: Partial<ApplicantInformation>;
};

class MakeMobileSignUpFactory extends PayloadFactory<MakeMobileSignUp> {
  protected payloadCategory = "fullForm";
  protected nestedFactories = {
    applicantInformation: applicantInformationFactory,
  };
}

export const makeFullFormFactory = new MakeMobileSignUpFactory();
