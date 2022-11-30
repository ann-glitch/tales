const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});

//users' stories dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const stories = await Story.find({ user: req.user.id });

  res.status(200).render("index/dashboard", {
    stories,
  });
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;
