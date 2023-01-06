const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.post("/createpost", requireLogin, (req, res) => {
  const date = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  console.log(date);
  const { resName, resLocation, resDetails, resImgUrl } = req.body;
  if (!resName || !resLocation || !resDetails) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    resName,
    resLocation,
    resDetails,
    resImgUrl,
    postedBy: req.user,
    postedDate: date,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/post/:postId", requireLogin, (req, res) => {
  // console.log(req.body);
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/updatepost", requireLogin, (req, res) => {
  // console.log("Update post");
  // console.log(req.body.postId);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      resName: req.body.resName,
      resLocation: req.body.resLocation,
      resDetails: req.body.resDetails,
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
        console.log(result);
      }
    });
});

router.put("/like", requireLogin, (req, res) => {
  // console.log("Like");
  // console.log(req.body.postId);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  // console.log("Comment");
  // console.log(req.body);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/deletecomment", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: { _id: req.body.commentId } },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  console.log("backend del api called");
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      } else if (post.postedBy._id.toString() === req.user._id.toString()) {
        console.log("deleting");
        post
          .remove()
          .then(() => {
            res.json({ message: "Deleted Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
