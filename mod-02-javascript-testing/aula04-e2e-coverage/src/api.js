const http = require("http");

const DEFAULT_USER = {
  username: "kianelc",
  password: "123",
};

const { once } = require("events");

const routes = {
  "/contact:get": (request, response) => {
    response.write("contact us page");
    return response.end();
  },
  "/login:post": async (request, response) => {
    const user = JSON.parse(await once(request, "data"));
    const toLower = (text) => text.toLowerCase();
    if (
      toLower(user.username) !== toLower(DEFAULT_USER.username) ||
      user.password !== DEFAULT_USER.password
    ) {
      response.writeHead(401);
      response.end("Log in failed!");
      return;
    }

    return response.end("Log in successed");
  },
  default(request, response) {
    response.writeHead(404);
    return response.end("not found");
  },
};

function handler(request, response) {
  const { url, method } = request;
  const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`;
  const chosen = routes[routeKey] || routes.default;

  return chosen(request, response);
}

const app = http.createServer(handler).listen(3000, () => {
  console.log("running at 3000");
});

module.exports = app;
