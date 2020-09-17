const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const port = process.env.PORT || 5000;

const SECRET = "This is my Secret";
const { mongoURI } = require("./src/config/keys");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Database Connected"))
  .on("error", (err) => console.log(err));

let UserSchema = require("./src/models/user");
let PostSchema = require("./src/models/post");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, "build")));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/api/posts", (req, res) => {
  PostSchema.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
});

app.post("/api/posts", (req, res) => {
  const { content, user, avatar } = req.body;
  let post = new PostSchema();

  var currentdate = new Date();
  var datetime =
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

app.get("/api/users", (req, res) => {
  UserSchema.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

app.delete("/api/delpost", (req, res) => {
  var time = req.query.time;
  console.log(time);
  let query = { timestamp: time };
  PostSchema.deleteOne(query, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      PostSchema.find({}, (err, posts) => {
        if (err) {
          console.log(err);
        } else {
          res.json(posts);
        }
      });
    }
  });
});

app.get("/api/posts/:id", (req, res) => {
  var id = req.params.id;
  PostSchema.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      var length = posts.length;
      var x = [];
      for (let i = 0; i < length; i++) {
        if (posts[i].user === id) {
          x.push(posts[i]);
        }
      }
      res.json(x);
    }
  });
});

app.get("/api/user/:id", (req, res) => {
  var id = req.params.id;
  UserSchema.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      var length = users.length;
      var x = [];
      for (let i = 0; i < length; i++) {
        if (users[i].id === id) {
          x.push(users[i]);
        }
      }
      res.status(200).json({
        username: x[0].id,
        avatar: x[0].avatar,
        follows: x[0].follows,
      });
    }
  });
});

app.post("/api/register", (req, res) => {
  const { id, password, avatar } = req.body;
  if (id !== null && password !== null && avatar !== null) {
    const follows = [];
    UserSchema.find({}, (err, users) => {
      if (err) {
        console.log(err);
      } else {
        var user = users.filter((u) => u.id === id)[0];
        if (user) {
          return res.status(401).json({ error: "Try again with another Id" });
        } else {
          let user = new UserSchema();
          user.id = id;
          user.avatar = avatar;
          user.password = password;
          user.follows = follows;
          user.save(function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              console.log("User registerd Successful");
            }
          });
        }
      }
    });
  } else {
    console.log("Id, Password and Avatar link is required");
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  UserSchema.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      const user = users.filter((u) => u.id === username)[0];
      if (!user) {
        return res.status(401).json({ error: "invalid username or password" });
      } else {
        if (password === user.password) {
          const userForToken = {
            username: user.id,
          };
          const token = jwt.sign(userForToken, SECRET);
          return res.status(200).json({
            token,
            username: user.id,
            avatar: user.avatar,
            follows: user.follows,
          });
        } else {
          return res
            .status(401)
            .json({ error: "invalid username or password" });
        }
      }
    }
  });
});

app.post("/api/follow", (req, res) => {
  const { user, follow } = req.body;
  UserSchema.updateOne(
    { id: user },
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
        UserSchema.find({}, (err, users) => {
          if (err) {
            console.log(err);
          } else {
            res.json(users.filter((e) => e.id === user)[0].follows);
          }
        });
      }
    }
  );
});

app.post("/api/unfollow", (req, res) => {
  const { user, follow } = req.body;
  UserSchema.updateOne(
    { id: user },
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
        UserSchema.find({}, (err, users) => {
          if (err) {
            console.log(err);
          } else {
            res.json(users.filter((e) => e.id === user)[0].follows);
          }
        });
      }
    }
  );
});

app.put("/api/follow", (req, res) => {
  const { timestamp } = req.body;
  console.log(timestamp);
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
        PostSchema.find({}, (err, posts) => {
          if (err) {
            console.log(err);
          } else {
            res.json(posts.filter((e) => e.timestamp === timestamp)[0].likes);
            console.log(posts);
          }
        });
      }
    }
  );
});
