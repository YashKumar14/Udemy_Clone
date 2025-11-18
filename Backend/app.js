require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cors = require("cors");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");
const routes = require("./routes/routers");

require("./db_connections/connections");
require("./cron-jobs/otpCronJobs");

app.use(express.json());
// app.use(cors());

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://192.168.0.110:8081",
      "http://192.168.0.111:8081",
      "http://192.168.0.115:8081",
      "http://192.168.0.104:8081",
      "http://192.168.1.25:8081",
      "http://localhost:8081",
      "https://udemy-clone-seven-swart.vercel.app",
      "https://udemyclone.online",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
const ip = process.env.SERVER_IP || "0.0.0.0";

const start = async () => {
  try {
    app.listen(port, ip, () => {
      console.log(`Server is listening on port: http://${ip}:${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
