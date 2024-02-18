"client-only";
import { utcToZonedTime } from "date-fns-tz";

export class Tempo extends Date {
  static timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  /**
   * Parse the UTC time to client machine Timezone
   * @param date - UTC time
   */
  constructor(date?: Date | number | string) {
    if (date instanceof Tempo) return date;

    const zonedDate = utcToZonedTime(date || new Date(), Tempo.timezone);
    super(zonedDate);
  }

  static now() {
    return new Tempo().getTime();
  }
}
