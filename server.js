const express = require("express");
const fs = require("file-system");
const path = require("path");
// const reload = require("reload");
const bodyParser = require("body-parser");
const http = require("http");

const serverHelper = require("./Server/index");

const app = express();

app.set("port", process.env.PORT || 3002);
app.use(express.static(path.join(__dirname, "server.js")));
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded

// app.get('/ping', function (req, res) {
//  return res.send('pong');
// });

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

var server = http.createServer(app);

// Reload code here
// reload(app).then(function (reloadReturned) {
// reloadReturned is documented in the returns API in the README

// Reload started, start web server
server.listen(app.get("port"), function() {
  console.log("Web server listening on port " + app.get("port"));
});

app.get("/api", async function(req, res) {
  let data1 = JSON.stringify(JSON.parse(await getData(), null, 2));
  // res.send("server running... ").send(data1);
  // console.log("hi")
  res.jsonp(data1);
});

app.get("/api/insertCat", async function(req, res) {
  console.log(req.query);
  let query = req.query;
  let { name } = query;

  if (!name) res.send(404);
  let newCat = JSON.parse(serverHelper.addCategory(name));
  res.jsonp(newCat);
});

app.get("/api/removeCat", async function(req, res) {
  console.log(req.query);
  let query = req.query;
  let { name } = query;

  if (!name) res.send(404);
  let newCat = JSON.parse(serverHelper.removeCategory(name));
  res.jsonp(newCat);
});

app.get("/api/lastChecked", async function(req, res) {
  console.log(req.query);
  let query = req.query;
  let { name } = query;
  console.log(name);
  if (!name) res.send(404);
  console.log("task : ", name);
  let newCat = JSON.parse(serverHelper.updatedLastTask(name));
  res.jsonp(newCat);
});

// }).catch(function (err) {
//   console.error('Reload could not start, could not start server/sample app', err)
// })

// app.get('/', async function (req, res) {
//   let data1 = JSON.stringify(JSON.parse(await getData(), null, 4));
//   // res.send("server running... ").send(data1);
//   console.log("hi")
//   res.jsonp(data1)
// });
// const port = process.env.PORT || 8100;
// app.listen(port, ()=>{
//   console.log("server running on port : http://localhost:" + port )
// })

async function getData() {
  return fs.readFileSync("data.json", "utf-8");
}
