require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { unless } = require("express-unless");
const routes = require("./routes/index");
// const { authenticateRoutes } = require("./config/unlessRoutes");
// const { authenticate } = require("./middlewares/auth.middleware");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));  



// authenticate.unless = unless;
// app.use(authenticate.unless(authenticateRoutes));

app.get("/decode", (req, res) => {
  res.status(200).json({ message: "Token Decoded Successfully!", decodedToken : req.user });
});

app.use(require('./middlewares/paginate').paginate)

app.use(globalErrorHandler);
app.use('/api', routes);
module.exports = app;
