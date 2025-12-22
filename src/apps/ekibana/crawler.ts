import dayjs from "dayjs";

const CALENDAR_URL_LIST = {
  thisYear:
    "https://www.ekibana.com/%E5%87%BA%E5%BA%97%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC",
  // e.g) https://www.ekibana.com/ekibanacalendar2023
  pastedYear: "https://www.ekibana.com/ekibanacalendar",
};

const CALENDAR_IMAGE_REGEX = /ekibana_calendar(1[0-2]|[1-9])_web\.jpeg$/;

export class CalendarFutureYearError extends Error {};
export class CalendarNotFoundError extends Error {};

const getAllCalendarUrlsByYear = async (year: number, env: Cloudflare.Env) => {
  const thisYear = dayjs().year();
  if (year > thisYear) {
    throw new CalendarFutureYearError("Year cannot be in the future");
  }

  const calendarUrl =
    year === thisYear
      ? CALENDAR_URL_LIST.thisYear
      : `${CALENDAR_URL_LIST.pastedYear}${year}`;

  const calendarPage = await fetch(calendarUrl);
  if (calendarPage.status === 404) {
    throw new CalendarNotFoundError(`Calendar not found for year ${year}`);
  }

  if (!calendarPage.ok) {
    throw new Error(`Failed to fetch calendar page for year ${year}`);
  }

  const kvSrcList = await env.HANAGE_BOT_V2_CALENDAR.get(String(year));
  if (kvSrcList) {
    return JSON.parse(kvSrcList) as string[];
  }

  const srcList: string[] = [];
  await new HTMLRewriter()
    .on("img", {
      element(el) {
        const src = el.getAttribute("src");
        if (src && CALENDAR_IMAGE_REGEX.test(src)) {
          srcList.push(src);
        }
      },
    })
    .transform(calendarPage)
    .text();

  env.HANAGE_BOT_V2_CALENDAR.put(String(year), JSON.stringify(srcList));

  return srcList;
};

export const getCalendarUrlByYearMonth = async (
  year: number,
  month: number,
  env: Cloudflare.Env
): Promise<string> => {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  const srcList = await getAllCalendarUrlsByYear(year, env);
  for (const src of srcList) {
    const match = src.match(CALENDAR_IMAGE_REGEX);
    if (match && parseInt(match[1], 10) === month) {
      return src;
    }
  }

  throw new CalendarNotFoundError(`Calendar image not found for ${year}-${month}`);
}
