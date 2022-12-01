const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const Story = require("../models/Story");

//show public stories
router.get("/", async (req, res) => {
  const stories = await Story.find({ status: "public" })
    .populate("user")
    .lean();

  res.status(200).render("stories/index", { stories });
});

//show single story
router.get("/show/:id", async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  })
    .populate("user")
    .lean();

  res.status(200).render("stories/show", { story });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

//edit story
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  res.status(200).render("stories/edit", {
    story,
  });
});

// add story
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

  const story = await Story.create(newStory);

  res.status(201).redirect(`/stories/show/${story.id}`);
});

//edit story
router.put("/:id", async (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const story = await Story.findByIdAndUpdate({
    _id: req.params.id,
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    new: true,
    runValidators: true,
  }).lean();

  res.status(200).redirect("/dashboard");
});

//delete story
router.delete("/:id", async (req, res) => {
  await Story.deleteOne({
    _id: req.params.id,
  });

  res.status(200).redirect("/dashboard");
});

module.exports = router;
