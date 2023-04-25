//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

require("dotenv").config()

mongoose.connect("mongodb+srv://admin-sanjay:"+process.env.USER_PASS+"@cluster0.3wo8evg.mongodb.net/blogDB");
const blogSchema = new mongoose.Schema({
  title:String,
  content:String,
})

const Post = new mongoose.model("Post",blogSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




app.get("/",(req,res)=>{
  async function getData(){
    try{
      const data =  await Post.find({});
      return data
    }catch(e){
      console.log(e);
    }

  }
  getData().then((data)=>{
   
    res.render("home",{startingContent:homeStartingContent,posts:data});
  })
 
})


app.get("/about",(req,res)=>{

  res.render("about",{aboutContent:aboutContent});
})


app.get("/contact",(req,res)=>{

  res.render("contact",{contactContent:contactContent});
})

app.get("/compose",(req,res)=>{
 
  res.render("compose");
})

app.post("/compose",(req,res)=>{
 
  const title=req.body.postTitle;
 const  content=req.body.postBody;
  const posts = new Post({
    title:title,
    content:content
  })

  posts.save()
  res.redirect("/");
})

app.get("/posts/:id",(req,res)=>{
  let id = req.params.id
  async function getData(){
    try{
      const data =  await Post.findOne({_id:id});
      return data
    }catch(e){
      console.log(e);
    }

  }
  getData().then((data)=>{
  
    res.render("post",{title:data.title,content:data.content})
  })


})

//Remove
app.get("/posts/:id/remove",(req,res)=>{
  let id = req.params.id
  async function getData(){
    try{
      const data =  await Post.findOne({_id:id});
      return data
    }catch(e){
      console.log(e);
    }

  }
  getData().then((data)=>{
  
    res.render("remove",{title:data.title,content:data.content,id:data._id})
  })


})

app.post("/remove",(req,res)=>{
const id = req.body.id;

async function deleteData(){
  try{
    const data =  await Post.deleteOne({_id:id});
    return data
  }catch(e){
    console.log(e);
  }

}
deleteData().then(()=>{

  res.redirect("/")
})

})

//Update
app.get("/posts/:id/update",(req,res)=>{
  let id = req.params.id
  async function getData(){
    try{
      const data =  await Post.findOne({_id:id});
      return data
    }catch(e){
      console.log(e);
    }

  }
  getData().then((data)=>{
  
    res.render("update",{title:data.title,content:data.content,id:data._id})
  })


})
app.post("/update",(req,res)=>{
  const id = req.body.id;
  const title=req.body.postTitle;
  const  content=req.body.postBody;
  async function updateData(){
    try{
      const data =  await Post.updateOne({_id:id},{$set:{title:title,content:content}});
      return data
    }catch(e){
      console.log(e);
    }
  
  }
  updateData().then(()=>{
  
    res.redirect("/")
  })
  
  })







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
