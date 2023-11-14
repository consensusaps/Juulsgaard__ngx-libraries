import dayjs from "dayjs";

class DayJsFormats {

  static readonly DATE_FORMATS: string[] = [
    `D-M-YYYY`,
    `M-D-YYYY`,
    `YYYY-M-D`
  ];

  static readonly TIME_FORMATS: string[] = [
    `h:m:s a`,
    `h:m a`,
    `h:m:s`,
    `h:m`
  ];

  static readonly DATE_TIME_FORMATS: string[] = [
    `YYYY-M-D h:m:s`,
    `YYYY-M-D h:m`,
    `D-M-YYYY h:m:s`,
    `D-M-YYYY h:m`,
    `M-D-YYYY h:m a`,
    `M-D-YYYY h:m:s a`
  ];

  readonly timeFormats: string[] = [];
  readonly dateFormats: string[] = [];
  readonly dateTimeFormats: string[] = [];

  constructor() {
    const localFormats = dayjs.Ls[dayjs.locale()]?.formats;

    if (localFormats) {

      // Date time formats
      if (localFormats.L && localFormats.LT) {
        this.dateTimeFormats.push(`${localFormats.L} ${localFormats.LT}`);
      }

      // Date formats
      if (localFormats.L) {
        this.dateFormats.push(localFormats.L);
        this.dateTimeFormats.push(...DayJsFormats.TIME_FORMATS.map(x => `${localFormats.L} ${x}`));
      }

      // Time formats
      if (localFormats.LT) {
        this.timeFormats.push(localFormats.LT);
      }

    } else {
      this.dateTimeFormats.push(...DayJsFormats.DATE_TIME_FORMATS);
    }

    this.timeFormats.push(...DayJsFormats.TIME_FORMATS);
    this.dateFormats.push(...DayJsFormats.DATE_FORMATS);
  }
}

export class DayjsHelper {

  private _formats?: DayJsFormats;
  private get formats() {
    if (this._formats) return this._formats;
    this._formats = new DayJsFormats();
    return this._formats;
  }

  parseDateStr(str: string) {
    return dayjs(str, this.formats.dateFormats, false);
  }

  parseTimeStr(str: string) {
    return dayjs(str, this.formats.timeFormats, false);
  }

  parseDateTimeStr(str: string) {
    return dayjs(str, this.formats.dateTimeFormats, false);
  }
}
