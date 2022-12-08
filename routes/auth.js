const express = require("express");
const router = express.Router();
const passport = require("passport");

//google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//verification
router.get("/verify", (req, res) => {
  try {
    if (req.user) {
      console.log(req.user);
    } else {
      console.log("Not Auth");
    }
  } catch (err) {
    console.log(err);
  }
});

//logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
