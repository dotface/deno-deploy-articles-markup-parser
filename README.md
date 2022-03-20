# dotface articles parser on [deno deploy]("https://dash.deno.com")

### how to use
```javascript
const markupParsed = await fetch(deno_deploy_url, {
  method: 'POST',
  body: JSON.stringify({ content: "article text" }),
  headers: { "Content-Type": "application/json" }
});
```
