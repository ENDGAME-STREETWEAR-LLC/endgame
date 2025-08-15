export function formatObjectJSON(object: Record<any, any>) {
  let stringArray: string[] = [];

  const entries = Object.entries(object);
  entries.forEach(([key, value]) => {
    const string = `${
      key.at(0)?.toUpperCase() + key.slice(1)
    }: ${value}`;
    stringArray.push(string);
  });

  return stringArray;
}
