/* eslint-disable  @typescript-eslint/no-explicit-any */

export function formatObjectJSON(object: Record<any, any>) {
  const stringArray: string[] = [];

  const entries = Object.entries(object);
  entries.forEach(([key, value]) => {
    const string = `${key.at(0)?.toUpperCase() + key.slice(1)}: ${JSON.stringify(value)}`;
    stringArray.push(string);
  });

  return stringArray;
}
