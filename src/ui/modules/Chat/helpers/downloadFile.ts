"client-only";

export function downloadFile(file: File) {
  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");

  link.style.display = "none";
  link.href = url;
  link.download = file.name;

  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
