import { z } from "@hono/zod-openapi";

export const GetCalendarParams = z
  .object({
    year: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(2017, { message: "Year must be 2017 or later" })
        // NOTE: Cloudflare WorkersのGlobal Scopeでは1970が固定で返ってくるため、使えない
        // .max(new Date().getFullYear(), {
        //   message: "Year cannot be in the future",
        // })
    ),
    month: z.preprocess(
      (val) => Number(val),
      z.number().min(1).max(12)
    ),
  })
  .openapi("GetCalendarParams");
