const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const connectToDatabase = require("./config");
const port = 3000;

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');
app.use(express.static("public"));

app.get("/",(req, res)=>{
    res.render("login");
});

app.get("/signup",(req, res)=>{
    res.render("signup");
});

app.get("/profile",(req, res)=>{
    res.render("profile");
});

app.get("/changepassword",(req, res)=>{
    res.render("changepassword");
});

app.post("/changepassword",(req, res)=>{
    //syntax update database
});

app.post("/signup", async(req,res)=>{
    try {
        const collection = await connectToDatabase();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            username: req.body.username,
            password: hashedPassword,
            status: req.body.status
        };

        const result = await collection.insertOne(userData);
        console.log("User inserted:", result.insertedId); // output id of inserted user
        res.send("User signed up successfully!");
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).send("Error signing up user. Please try again later.");
    }
});

app.post("/login", async(req,res)=>{
    try {
        const collection = await connectToDatabase();
        const check = await collection.findOne({username: req.body.username});
        if(!check){
            res.send("username / password incorect");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        }else{
            res.send("username / password incorect");
        }
    } catch (error) {
        res.send("wrong Details");
    }
});

app.listen(port,()=>{
    console.log(`Server is running on Port : ${port}`);
});