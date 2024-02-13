export function createNestedFormData(data: any) {
  const formData = new FormData();

  const keys = flattenObjectKeys(data);

  keys.forEach((key) => {
    formData.append(key, data[key]);
  });

  return formData;
}

function flattenObjectKeys(obj: any, parentKey?: string): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    typeof obj[key] === "object" && obj[key] !== null
      ? (keys = keys.concat(flattenObjectKeys(obj[key], currentKey)))
      : keys.push(currentKey);
  }

  return keys;
}
