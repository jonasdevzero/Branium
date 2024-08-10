const thresh = 1024;
const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const decimals = 1;
const r = 10 ** decimals;

export function getSizeName(size: number) {
  if (Math.abs(size) < thresh) {
    return size + " B";
  }

  let u = -1;

  do {
    size /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(size) * r) / r >= thresh &&
    u < units.length - 1
  );

  return size.toFixed(decimals) + " " + units[u];
}
