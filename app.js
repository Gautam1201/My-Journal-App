require('dotenv').config();
const express = require("express");
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String
});

const Post = mongoose.model("Post",postSchema);

//Starting Content
const homeStartingContent = {
  greeting: "Hi There 👋,",
  desc: "To Create a Blog, please click on the link given above."
}

const aboutContent = {
  name: "Gautam Pruthi",
  desc: "Full-Stack web developer"
}

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
  Post.find({},function(err,posts){
    if(!err){
      res.render("home",{homeContent: homeStartingContent, posts: posts});
    }
  });

});

app.get("/about",(req,res)=>{
  res.render("about",{aboutMe: aboutContent});
});

app.get("/compose",(req,res)=>{
  res.render("compose");
});

app.get("/posts/:postHeading",(req,res)=>{

  Post.findOne({postTitle: req.params.postHeading},function(err,post){
    res.render("post",{postTitle: _.startCase(post.postTitle),postBody: post.postBody});
  });

});

app.post("/compose",(req,res)=>{
  const post = new Post({
    postTitle: _.startCase(req.body.blogEntry),
    postBody: req.body.entryContent
  });
  // console.log(post);
  post.save(function(err){
    if(!err) res.redirect("/");
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port,function(){
  console.log("Server has Started");
});
