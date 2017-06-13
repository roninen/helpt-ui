// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('mock-api/db-live.json')
const middlewares = jsonServer.defaults()

router.render = (req, res) => {
  const match = req.url.match(/\/([a-z]+)\//);
  if (match) {
    const resource = match[1];
    if (res.locals.data) {
        res.jsonp({
            [resource]: res.locals.data
        });
    }
  }
}

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server mock API is running')
})
