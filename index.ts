import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { moment } from "https://deno.land/x/deno_ts_moment/mod.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = `Hello world! ${moment().format("YYYY-MM-DD")}`;
  })
  .get("/shrt/:urlid", (context) => {
     const jsonResponse = await fetch("https://raw.githubusercontent.com/YogPanjarale/deno-url-shortener/master/urls.json");
     const jsonData = await jsonResponse.json();
     const urls = JSON.parse(jsonData);

    if (context.params && context.params.urlid && urls[context.params.urlid]) {
      if (
        urls[context.params.urlid].expiryDate > moment().format("YYYY-MM-DD")
      ) {
        context.response.redirect(urls[context.params.urlid].dest);
      } else {
        context.response.body = "Link Expired";
      }
    } else {
      context.response.body = "404";
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("> Listening on http://localhost:8000");

await app.listen();

console.log("REEEEEE")
