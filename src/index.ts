import { OpenAPIHono } from "@hono/zod-openapi";
import { ekibanaApp } from "./apps/ekibana";

const app = new OpenAPIHono();

app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    title: "hanage-bot-v2 API",
    description: "API for hanage-bot-v2",
    version: "1.0.0",
  },
});

app.get("/", (c) => {
  return c.text("Hello hanage-bot-v2👃");
});

app.route("/api/v1/ekibana", ekibanaApp);

export default app;
