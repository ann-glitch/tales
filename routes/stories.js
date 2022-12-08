const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const asyncHandler = require("express-async-handler");
const Story = require("../models/Story");

//show public stories
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ date: "desc" })
      .lean();

    res.status(200).render("stories/index", { stories });
  })
);

//show single story
router.get(
  "/show/:id",
  asyncHandler(async (req, res) => {
    const story = await Story.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .populate("comments.commentUser")
      .lean();

    if (story.status == "public") {
      res.status(200).render("stories/show", { story });
    } else {
      if (req.user) {
        if (req.user.id == story.user._id) {
          res.status(200).render("stories/show", { story });
        } else {
          res.redirect("/stories");
        }
      } else {
        res.redirect("/stories");
      }
    }
  })
);

//get story add form
router.get(
  "/add",
  asyncHandler(ensureAuthenticated, (req, res) => {
    res.render("stories/add");
  })
);

//edit story
router.get(
  "/edit/:id",
  asyncHandler(ensureAuthenticated, async (req, res) => {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (story.user != req.user.id) {
      return res.status(401).redirect("/stories");
    } else {
      // console.log(story);
      res.status(200).render("stories/edit", {
        ...story,
      });
    }
  })
);

//list stories from users
router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.status(200).render("stories/index", { stories });
  })
);

//logged in user stories
router.get(
  "/mystories",
  asyncHandler(ensureAuthenticated, async (req, res) => {
    const stories = await Story.find({
      user: req.user.id,
    })
      .populate("user")
      .lean();

    res.status(200).render("stories/index", { stories });
  })
);

// add story
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newStory = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments: req.body.allowComments === "on",
      user: req.user.id,
    };

    const story = await Story.create(newStory);

    res.status(201).redirect(`/stories/show/${story.id}`);
  })
);

//edit story
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    req.body.allowComments = req.body.allowComments === "on";

    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).redirect("/dashboard");
  })
);

//delete story
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Story.deleteOne({
      _id: req.params.id,
    });

    res.status(200).redirect("/dashboard");
  })
);

//add comments
router.post(
  "/comment/:id",
  asyncHandler(async (req, res) => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id,
    };

    const story = await Story.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: {
          comments: newComment,
        },
      }
    );

    res.status(201).redirect(`stories/show/${story.id}`);
  })
);

module.exports = router;
