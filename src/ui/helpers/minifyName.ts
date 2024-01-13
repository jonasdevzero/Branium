export function minifyName(name: string) {
  const parts = name.split(" ");

  if (parts.length === 0) return "No name";

  if (parts.length === 1) return name.slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
