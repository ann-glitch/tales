const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const Story = require("../models/Story");

router.get("/", async (req, res) => {
  const stories = await Story.find({ status: "public" })
    .populate("user")
    .lean();

  res.status(200).render("stories/index", { stories });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.post("/", async (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id,
  };

  await Story.create(newStory);

  res.status(201).redirect(`/stories/show/${story.id}`);
});

module.exports = router;
