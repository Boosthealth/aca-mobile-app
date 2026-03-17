/**
 * utils.maskSSN
 *
 * Returns the masked Social Security Number (SSN), showing only the last four digits.
 * The returned format will be `xxx-xx-1234`.
 * @param ssn - {number | string}: The full SSN as a number or string.
 * @returns - {string}
 */
export const maskSSN = (ssn: number | string): string => {
  const cleaned = ssn.toString().replace(/\D/g, "");

  if (cleaned.length !== 9) {
    return "Invalid SSN";
  }

  return `xxx-xx-${cleaned.slice(-4)}`;
};
