require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { unless } = require("express-unless");
const routes = require("./routes/index");
const { authenticateRoutes } = require("./config/unlessRoutes");
const { authenticate } = require("./middlewares/auth.middleware");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));  
app.use('/images', express.static(path.join(__dirname, 'public/images')));




authenticate.unless = unless;
app.use(authenticate.unless(authenticateRoutes));

app.get("/decode", (req, res) => {
  res.status(200).json({ message: "Token Decoded Successfully!", decodedToken : req.user });
});
app.get('/testing', (req, res) => {
  res.status(200).json({ message: "Welcome to the API!" });
});
app.use(require('./middlewares/paginate').paginate)

app.use('/api', routes);
app.use(globalErrorHandler);
module.exports = app;
