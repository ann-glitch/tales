const express = require("express");
const dotenv = require("dotenv");

const app = express();

app.get("/", (req, res) => {
  res.send("It works!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
