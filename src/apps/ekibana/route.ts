import { createRoute } from "@hono/zod-openapi";
import { GetCalendarParams } from "./openapi";

export const getCalendarRoute = createRoute({
  method: "get",
  path: "/calendar",
  request: {
    query: GetCalendarParams,
  },
  responses: {
    200: {
      description: "Calendar Image",
      content: {
        "image/jpeg": {
          schema: { type: "string", format: "binary" },
        },
      },
    },
    400: {
      description: "Bad Request",
    },
    404: {
      description: "Calendar Not Found",
    },
  },
});
