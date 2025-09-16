/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * Function to format objects parsed from JSON data
 * @param object Any object that can be stringified into JSON format
 * @returns An array of strings, each item containing a formatted object entry
 */
export function formatObjectJSON(object: Record<any, any>) {
  const stringArray: string[] = [];

  const entries = Object.entries(object);
  entries.forEach(([key, value]) => {
    let formattedValue;
    if (Array.isArray(value)) {
      formattedValue = value.map((item) => {
        if (typeof item !== "object") return JSON.stringify(item);
        return formatObjectJSON(item);
      });
    } else if (typeof value === "object") {
      formattedValue = formatObjectJSON(value);
    } else {
      formattedValue = JSON.stringify(value);
    }

    const string = `${
      key.at(0)?.toUpperCase() + key.slice(1)
    }: ${formattedValue}`;
    stringArray.push(string);
  });

  return stringArray;
}
