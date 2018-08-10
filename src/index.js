import "./env";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const {
  NODE_ENV = "development",
  PORT = 3002,
  APP_NAME = "giffer"
} = process.env;

import create from "./create";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use("/tmp", express.static("tmp"));

app.post("/create", create);

app.listen(PORT, err => {
  err && console.error(err);
  NODE_ENV == "development" && console.log("> in development");
  console.log(`> ${APP_NAME} listening on port ${PORT}`);
});
