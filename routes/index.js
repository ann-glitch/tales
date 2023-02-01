const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// home page
router.get("/", ensureGuest, (req, res) => {
  res.status(200).render("index/welcome");
});

//users' stories dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const stories = await Story.find({ user: req.user.id });

  res.status(200).render("index/dashboard", {
    stories,
  });
});

// about route
router.get("/about", (req, res) => {
  res.status(200).render("index/about");
});

module.exports = router;
