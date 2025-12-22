import { OpenAPIHono } from "@hono/zod-openapi";
import { getCalendarRoute } from "./route";
import {
  CalendarFutureYearError,
  CalendarNotFoundError,
  getCalendarUrlByYearMonth,
} from "./crawler";

export const ekibanaApp = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

ekibanaApp.openapi(getCalendarRoute, async (c) => {
  const { year, month } = c.req.valid("query");

  try {
    const calendarUrl = await getCalendarUrlByYearMonth(year, month, c.env);
    const image = await fetch(calendarUrl);
    if (!image.ok) {
      return c.text("Image Not Found", 404);
    }

    return c.body(await image.arrayBuffer(), 200, {
      "Content-Type": "image/jpeg",
    });
  } catch (error) {
    if (error instanceof CalendarFutureYearError) {
      return c.text("Year cannot be in the future", 400);
    }

    if (error instanceof CalendarNotFoundError) {
      return c.text("Calendar Not Found", 404);
    }

    throw error;
  }
});
