const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("passport");
const connectDB = require("./config/db");
const methodOverride = require("method-override");
const colors = require("colors");
const Handlebars = require("handlebars");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
const PORT = process.env.PORT || 5000;

//load env vars
dotenv.config({ path: "./config/config.env" });

//connectDB
connectDB();

//load handlebars helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon,
} = require("./helpers/hbs");

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//method override
app.use(methodOverride("_method"));

//passport config
require("./config/passport")(passport);

//Handlebars middlewares
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      truncate,
      stripTags,
      formatDate,
      select,
      editIcon,
    },
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");

//load route files
const auth = require("./routes/auth");
const index = require("./routes/index");
const stories = require("./routes/stories");

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy

  // serve secure cookies
  app.use(
    session({
      cookie: {
        secure: true,
      },
    })
  );
}

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set globals variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//set static folder
app.use(express.static(path.join(__dirname, "/public")));

//mount routers
app.use("/auth", auth);
app.use("/", index);
app.use("/stories", stories);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.cyan);
});

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`MongoServerError: ${err.message}`.red);

  //close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
