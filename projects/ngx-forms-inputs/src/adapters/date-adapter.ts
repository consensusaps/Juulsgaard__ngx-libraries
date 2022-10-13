import dayjs, {Dayjs} from "dayjs";
import {DateAdapter, MAT_DATE_LOCALE, MatDateFormats} from "@angular/material/core";
import {Inject, Optional} from "@angular/core";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

export class DayjsDateAdapter extends DateAdapter<Dayjs> {

  private localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string,) {
    super();

    super.setLocale(matDateLocale);

    const now = this.create();
    const localeData = now.localeData();
    this.localeData = {
      firstDayOfWeek: localeData.firstDayOfWeek(),
      longMonths: localeData.months(),
      shortMonths: localeData.monthsShort(),
      dates: Array.from(Array(31), (_, i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: Array.from(Array(7), (_, i) => now.set('day', i).format('dddd')),
      shortDaysOfWeek: localeData.weekdaysShort(),
      narrowDaysOfWeek: localeData.weekdaysMin(),
    };
  }

  addCalendarDays(date: Dayjs, days: number): Dayjs {
    return date.add(days, 'days');
  }

  addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return date.add(months, 'months');
  }

  addCalendarYears(date: Dayjs, years: number): Dayjs {
    return date.add(years, 'years');
  }

  clone(date: Dayjs): Dayjs {
    return dayjs(date);
  }

  createDate(year: number, month: number, date: number): Dayjs {
    return this.create(0).year(year).month(month).date(date);
  }

  format(date: Dayjs, displayFormat: any): string {
    return date.format(displayFormat);
  }

  getDate(date: Dayjs): number {
    return date.date();
  }

  getDateNames(): string[] {
    return this.localeData.dates;
  }

  getDayOfWeek(date: Dayjs): number {
    return date.day();
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long":
        return this.localeData.longDaysOfWeek;
      case "short":
        return this.localeData.shortDaysOfWeek;
      case "narrow":
        return this.localeData.narrowDaysOfWeek;
    }
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek;
  }

  getMonth(date: Dayjs): number {
    return date.month();
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    return style === "long" ? this.localeData.longMonths : this.localeData.shortMonths;
  }

  getNumDaysInMonth(date: Dayjs): number {
    return date.daysInMonth();
  }

  getYear(date: Dayjs): number {
    return date.year();
  }

  getYearName(date: Dayjs): string {
    return date.format('YYYY');
  }

  invalid(): Dayjs {
    return this.create(null);
  }

  isDateInstance(obj: any): boolean {
    return dayjs.isDayjs(obj);
  }

  isValid(date: Dayjs): boolean {
    return date.isValid();
  }

  parse(value: any, parseFormat: string): Dayjs | null {
    return value ? this.create(value, parseFormat) : null;
  }

  toIso8601(date: Dayjs): string {
    return date.toISOString();
  }

  today(): Dayjs {
    return this.create();
  }

  create(time?: any, format?: string) {
    return dayjs(time, { format, locale: this.locale, utc: true });
  }

}

export const MAT_DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
