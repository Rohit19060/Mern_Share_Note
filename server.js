// All the packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");

// Process Constants
const port = process.env.PORT || 5000;
const SECRET = process.env.SECRET || "This is my Secret";

const app = express();

// Database Related
const { mongoURI } = require("./src/config/keys");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Database Connected"))
  .on("error", (err) => console.log(err));

// Schema
let UserSchema = require("./src/models/user");
let PostSchema = require("./src/models/post");

// App use
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "build")));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// All Post Get Request
app.get("/api/posts", (req, res) => {
  PostSchema.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.json(posts.reverse());
    }
  });
});

// Post inserting in database
app.post("/api/posts", (req, res) => {
  const { content, user, avatar } = req.body;
  let post = new PostSchema();
  const currentdate = new Date();
  const datetime =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    "_" +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  post.timestamp = datetime;
  post.user = user;
  post.content = content;
  post.likes = 0;
  post.avatar = avatar;
  post.save(function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.json(post);
    }
  });
});

// All users get request
app.get("/api/users", (req, res) => {
  UserSchema.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

app.get("/api/userforpost", (req, res) => {
  UserSchema.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      let data = [];
      users.forEach((element) => {
        data.push(element.id);
      });
      res.json(data);
    }
  });
});

// Post delete based on timestamp
app.delete("/api/delpost", (req, res) => {
  const time = req.query.time;
  PostSchema.deleteOne({ timestamp: time }, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      PostSchema.find({}, (err, posts) => {
        if (err) {
          console.log(err);
        } else {
          res.json(posts.reverse());
        }
      });
    }
  });
});

// Post based on user id
app.get("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  PostSchema.find({ user: id }, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.json(posts.reverse());
    }
  });
});

// Send user info for userpage
app.get("/api/user/:id", (req, res) => {
  const id = req.params.id;
  UserSchema.find({ id: id }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        username: user[0].id,
        avatar: user[0].avatar,
        follows: user[0].follows,
      });
    }
  });
});

// new user registeration
app.post("/api/register", async (req, res) => {
  const { id, password, avatar } = req.body;
  if (id !== null && password !== null && avatar !== null) {
    let hashedpassword = await bcrypt.hash(password, 10);
    UserSchema.find({ id: id }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user[0]) {
          return res.status(401).json({ error: "Try again with another Id" });
        } else {
          let user = new UserSchema();
          user.id = id;
          user.avatar = avatar;
          user.password = hashedpassword;
          user.follows = [];
          user.save(function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              res.json(user.id);
            }
          });
        }
      }
    });
  } else {
    return res.status(401).json({
      error: "Id, Password and Avatar link is required",
    });
  }
});

// Login Req/res
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserSchema.findOne({ id: username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  const userForToken = {
    username: user.id,
    id: user._id,
  };
  const token = jwt.sign(userForToken, SECRET);
  return res.status(200).json({
    token,
    username: user.id,
    avatar: user.avatar,
    follows: user.follows,
  });
});

// FOllow request based on user Token
app.post("/api/follow", async (req, res) => {
  const { token, follow } = req.body;
  const decodedToken = jwt.verify(token, SECRET);
  const id = decodedToken.id;
  if (!token || !id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  UserSchema.updateOne(
    { _id: id },
    {
      $push: {
        follows: follow,
      },
    },
    {
      upsert: true,
      multi: true,
    },
    (err, users) => {
      if (err) {
        console.log(err);
      } else {
        UserSchema.find({ _id: id }, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            res.json(user[0].follows);
          }
        });
      }
    }
  );
});

// Unfollow request based on User Token
app.post("/api/unfollow", (req, res) => {
  const { token, follow } = req.body;
  const decodedToken = jwt.verify(token, SECRET);
  const id = decodedToken.id;
  if (!token || !id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  UserSchema.updateOne(
    { _id: id },
    {
      $pull: {
        follows: follow,
      },
    },
    {
      upsert: true,
      multi: true,
    },
    (err, users) => {
      if (err) {
        console.log(err);
      } else {
        UserSchema.find({ _id: id }, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            res.json(user[0].follows);
          }
        });
      }
    }
  );
});

// Increment likes based on TimeStamp
app.put("/api/likes", (req, res) => {
  const { timestamp } = req.body;
  PostSchema.updateOne(
    { timestamp: timestamp },
    {
      $inc: {
        likes: 1,
      },
    },
    {
      upsert: true,
      multi: true,
    },
    (err, posts) => {
      if (err) {
        console.log(err);
      } else {
        console.log(posts);
      }
    }
  );
});
