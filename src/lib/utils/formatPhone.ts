/**
 * utils.formatPhone
 *
 * Formats a phone number string dynamically using a mask (default: (xxx) xxx-xxxx).
 * Removes non-digit characters and leading 0/1 (unless mask starts with 1).
 * Supports look-ahead for dividers to improve mobile UX.
 *
 * @param {string | undefined} input - The input phone number string which may contain any characters.
 * @param {string | undefined} formatMask - Optional format mask where 'x' represents a digit placeholder.
 *   Examples: "(xxx) xxx-xxxx" → "(888) 574-0677", "1-xxx-xxx-xxxx" → "1-888-574-0677"
 * @returns {string} The formatted phone number according to the mask or default format.
 */

export const formatPhone = (input: string | undefined, formatMask?: string): string => {
  if (!input) return "";

  // 1. Remove all non-digit characters
  let cleaned = input.replace(/\D/g, "");

  const mask = formatMask || "(xxx) xxx-xxxx";
  const maskStartsWithOne = mask.trim().startsWith("1");

  // 2. Remove leading 0 and 1 if the mask is not intended for them
  if (!maskStartsWithOne) {
    while (cleaned.startsWith("0") || cleaned.startsWith("1")) {
      cleaned = cleaned.slice(1);
    }
  }

  let result = "";
  let digitIndex = 0;

  // 3. Apply the mask
  for (let i = 0; i < mask.length && digitIndex < cleaned.length; i++) {
    if (mask[i].toLowerCase() === "x") {
      result += cleaned[digitIndex];
      digitIndex++;
    } else {
      result += mask[i];
    }
  }

  // 4. Look-ahead logic: add next separators if more digits are present
  let lookAheadIndex = result.length;
  while (
    lookAheadIndex < mask.length &&
    mask[lookAheadIndex].toLowerCase() !== "x" &&
    digitIndex < cleaned.length
  ) {
    result += mask[lookAheadIndex];
    lookAheadIndex++;
  }

  return result;
};
