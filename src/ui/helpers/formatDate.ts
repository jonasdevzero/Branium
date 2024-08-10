const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date | string | number) {
  return dateFormatter
    .format(new Date(date))
    .replace(",", " -")
    .replace(":", "h");
}

export function formatTime(date: Date | string | number) {
  return timeFormatter.format(new Date(date)).replace(":", "h");
}
