//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect('mongodb+srv://admin-dejun:Stashia18!@cluster0.noqgl.mongodb.net/blogDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Database
const postSchema = {
  title: String,
  content: String,
  date: String,
  description: String,
  imgURL: String
}

const Post = mongoose.model("post", postSchema);

//Routing
app.get('/', function(req, res) {
    Post.find({}, function(err, posts) {
    if (err) {
      console.log(err)
    } else {
      res.render('home', {
        posts: posts
      })
    }
  })
})

app.get('/blog', function(req, res) {
  Post.find({}, function(err, posts) {
    if (err) {
      console.log(err)
    } else {
      res.render('blog', {
        posts: posts
      })
    }
  })
})

app.get('/about', function(req, res) {
  res.render('about')
})

app.get('/contact', function(req, res) {
  res.render('contact')
})

app.get('/faqs', function(req, res) {
  res.render('faqs')
})

app.get('/compose', function(req, res) {
  res.render('compose');
})

app.post('/', function(req, res) {
  let postTitle = req.body.postTitle
  let postContent = req.body.postContent
  let imgURL = req.body.imgURL
  let description = req.body.postDescription

  const options = {
    month: 'long',
    day: "numeric",
    year: 'numeric'
  }
  let postDate = new Date().toLocaleDateString('en-US', options);
  const posts = new Post({
    title: postTitle,
    content: postContent,
    date: postDate,
    description: description,
    imgURL: imgURL
  })
  posts.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/');
    }
  })
})

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      date: post.date,
      content: post.content,
      imgURL: post.imgURL
    })



  });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
