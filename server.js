const express = require("express");
const { renderToString } = require("react-dom/server");

const SSR = require("./static");

const server = port => {
  const app = express();

  app.use(express.static("static"));
  app.get("/", (_, res) =>
    res.status(200).send(renderMarkup(renderToString(SSR)))
  );

  app.listen(port, () => process.send && process.send("online"));
};

server(process.env.PORT || 8080);

const renderMarkup = html => {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Webpack SSR Test</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="app">${html}</div>
    <script src="${process.env.BROWSER_REFRESH_URL}"></script>
  </body>
</html>`;
};
