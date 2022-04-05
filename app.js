const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./app/api/v1/users/router");
const authRouter = require("./app/api/v1/auth/router");
const categoryRouter = require("./app/api/v1/categories/router");
const speakerRouter = require("./app/api/v1/speakers/router");
const eventRouter = require("./app/api/v1/events/router");
const paymentRouter = require("./app/api/v1/payments/router");
const participantRouter = require("./app/api/v1/participants/router");
const transactionRouter = require("./app/api/v1/transactions/router");

// middleware
const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handle-error");

const app = express();
const cors = require("cors");

const versionV1 = "/api/v1";

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(`${versionV1}`, usersRouter);
app.use(`${versionV1}/auth`, authRouter);
app.use(`${versionV1}/categories`, categoryRouter);
app.use(`${versionV1}/speakers`, speakerRouter);
app.use(`${versionV1}/events`, eventRouter);
app.use(`${versionV1}/payments`, paymentRouter);
app.use(`${versionV1}`, participantRouter);
app.use(`${versionV1}/transactions`, transactionRouter);

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
