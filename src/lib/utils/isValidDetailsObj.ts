/**
 * utils.isValidDetailsObj
 *
 * Checks if an object is not empty and has at least one non-empty string value
 * @param obj - The object to validate
 * @returns true if object is not empty and has at least one non-empty value
 *
 * Example:
 * isValidDetailsObj({name: "John", age: ""}) // true - has non-empty value
 * isValidDetailsObj({name: "", age: ""}) // false - all values are empty
 * isValidDetailsObj({}) // false - empty object
 */
export function isValidDetailsObj<T extends Record<string, any>>(obj: T): boolean {
  // Check if object is not empty (has at least one key)
  if (Object.keys(obj).length === 0) {
    return false;
  }

  // Check if at least one value is not an empty string
  return Object.values(obj).some((value) => {
    // Handle different types of values
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;

    return true;
  });
}
