const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));

//body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

main()
.then(()=>{
    console.log('Database connection is successful')
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//Index Route
app.get("/chats",async (req,res)=>{
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs",{chats});
});
//new Message
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});

//Create Route
app.post("/chats",asyncWrap (async(req,res,next)=>{
        let {from,to,message} = req.body;
        let newChat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date()
    });

    await newChat.save();
    res.redirect("/chats");   
}));

// asyncWrap
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) =>next(err));
    };
}

// new Show Route
app.get("/chats/:id",asyncWrap (async (req,res,next)=>{
    let{id}= req.params;
    let chat = await Chat.findById(id);
    if (!chat){
        next( new ExpressError(404,"Chat not Found"));
    }
    res.render("edit.ejs",{chat});
}));

//edit Route
app.get("/chats/:id/edit", async (req,res) => {
    let {id} = req.params;
    let chat =await Chat.findById(id);
    res.render("edit.ejs",{chat});
});

//Update Route
app.put("/chats/:id",async (req,res) => {
    let {id} = req.params;
    let {message: newMessage}=req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        {message : newMessage},
        {runValidators : true, new:true}
    );
    console.log(updatedChat);
    res.redirect("/chats");
})


//To delete


app.delete("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});

app.get("/",(req,res)=>{
    res.send("Welcome to the Whatsapp mini App");
});

// Handle Validation Error
const handleValidationError = (err) =>{
    console.log("This was validation Error Please follow Rules");
    console.dir(err.message);
    return err;
}
app.use((err,req,res,next) =>{
    console.log(err.name);
    if(err.name ==="ValidationError"){
      err =   handleValidationError(err);
    }
    next(err);
});

// Error Handling Middleware
app.use((err,req,res,next)=>{
    let {status= 500, message="Page Not Found"}= err;
    res.status(400).send(message);
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});