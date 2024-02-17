export function createNestedFormData(data: any) {
  const formData = new FormData();

  const keys = flattenObjectKeys(data);

  keys.forEach((key) => {
    const subKeys = key.split(".");
    const lastKey = subKeys[subKeys.length - 1];
    let aux = data;

    if (subKeys.length === 1) {
      formData.append(key, aux[key]);
      return;
    }

    for (let index = 0; index < subKeys.length - 1; index++)
      aux = aux[subKeys[index]] || {};

    formData.append(key, aux[lastKey]);
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
