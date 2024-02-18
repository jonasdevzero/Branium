import { utcToZonedTime } from "date-fns-tz";

const TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || "America/Sao_Paulo";

type Time = Date | number | string;

class Tempo extends Date {
  static timezone = TIMEZONE;

  /**
   * Parse the UTC time to Timezone
   * @param date - UTC time
   */
  constructor(date?: Time) {
    if (date instanceof Tempo) {
      throw new Error("[Tempo] :: Tempo is for constructor");
    }

    const zonedDate = utcToZonedTime(date || new Date(), Tempo.timezone);
    super(zonedDate);
  }

  static now() {
    return new Tempo().getTime();
  }
}

export { Tempo };
