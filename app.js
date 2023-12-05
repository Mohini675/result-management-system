const express = require("express");
const expressLayout = require("express-ejs-layouts");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const connectDB = require("./server/database/dbConnection");
const { checkUser } = require("./server/middleware/authMiddleware");

const app = express();

//config file path
dotenv.config({ path: "config.env" });

//port
const port = process.env.PORT || 3000;

//for request passing format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(methodOverride("_method"));

//set the view engine as ejs
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "./layouts/main");

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Flash Messages
app.use(flash());

//mongodb connection
connectDB();

//load assests
app.use("/css", express.static(path.join(__dirname, "assets/css")));
app.use("/img", express.static(path.join(__dirname, "assets/img")));

//load routes
app.get("*", checkUser);
app.use("/", require("./server/routes/route"));
//error page
app.get("*", (req, res) => {
  res.status(404).render("404");
});

//port listen
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
