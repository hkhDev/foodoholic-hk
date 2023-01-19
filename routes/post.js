const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");
const cloudinary = require("cloudinary").v2;
const { Client } = require("@googlemaps/google-maps-services-js");
const { CLOUD_NAME, CLOUD_KEY, CLOUD_KEY_SECRET } = require("../config/keys");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_KEY_SECRET,
});

const client = new Client({});

router.post("/createpost", requireLogin, (req, res) => {
  // const date = new Date().toLocaleDateString("en", {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });
  const { resName, resLocation, resDetails, resImgsDetail } = req.body;
  if (!resName || !resLocation || !resDetails || !resImgsDetail) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = undefined;
  client
    .geocode({
      params: {
        address: resLocation,
        key: "AIzaSyDIepUcuQ8sApkWzlj2F077OU_PwZFSyhY",
      },
    })
    .then((r) => {
      // console.log("33");
      const district = r.data.results[0].address_components.reverse();
      console.log(r.data.results[0]);
      const post = new Post({
        resName,
        resLocation: district[4].long_name,
        resFullAddress: r.data.results[0].formatted_address,
        resDetails,
        resImgsDetail,
        resLocationLatLng: r.data.results[0].geometry.location,
        postedBy: req.user,
      });
      post
        .save()
        .then((result) => {
          res.json({ post: result });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
    });

  // console.log(resImgsDetail);
  // const post = new Post({
  //   resName,
  //   resLocation,
  //   resDetails,
  //   resImgsDetail,
  //   resLocationLatLng,
  //   postedBy: req.user,
  // });
  // post
  //   .save()
  //   .then((result) => {
  //     res.json({ post: result });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    // .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
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
    .sort("-createdAt")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/post/id/:postId", (req, res) => {
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
            post.resImgsDetail.map((img) => {
              cloudinary.uploader.destroy(img.imgId);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.post("/searchres", requireLogin, (req, res) => {
  let resPattern = new RegExp(req.body.searchText); ///^bar$/i
  const data = {};
  console.log(data);
  data[req.body.searchParam] = { $regex: resPattern, $options: "i" };
  Post.find(data)
    .populate("postedBy", "_id name")
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
