require("dotenv").config();
const express = require("express");
const http = require("http");
const configureSocket = require("./socket");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);

configureSocket(server);

// 解析 x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", routes);

app.listen(process.env.PORT, () =>
  console.log(`running @ ${process.env.PORT}`)
);
