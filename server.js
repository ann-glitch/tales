const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 5000;

//load env vars
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

//load route files
const auth = require("./routes/auth");

//mount routers
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("It works!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
