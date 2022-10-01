const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose")
const config = require("./config")

mongoose.connect(config.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("mongoDB connected..."));
app.listen(port, ()=>console.log("listening on port: " + port +"\t http://localhost:"+ port));

app.get('/',(req,res)=>{res.send("hello world!")});