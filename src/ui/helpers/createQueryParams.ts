export function createQueryParams(data: Object) {
  const query = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    const isInvalid =
      typeof value === "undefined" ||
      (typeof value === "string" && value.length === 0);

    if (isInvalid) return;

    const parsedValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    query.append(key, parsedValue);
  });

  return query;
}
