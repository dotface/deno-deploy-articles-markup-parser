import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import * as parser from "./parser.ts";

const router = new Router();
router.post("/", async ({ request, response }) => {
  const requestBody = request.body(); // content type automatically detected
  let content = "";
  if (requestBody.type === "json") {
    const value = await requestBody.value; // an object of parsed JSON
    content = value.content || "";
  }

  let result = parser.annotations(content);
  result = parser.images(result);
  result = await parser.links(result);

  response.body = JSON.stringify({ content: result });
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
await app.listen({ port: 8000 });
