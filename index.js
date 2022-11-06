const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const {User} = require('./models/User');
const config = require('./config');
const req = require("express/lib/request");


app.listen(port, ()=>console.log("listening on port: " + port +"\t http://localhost:"+ port));
//app.get('/',(req,res)=>{res.send("hello world!")});
//페이지 열었을시 나오는 문구
mongoose.connect(config.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("mongoDB connected..."));
app.use(bodyParser.urlencoded({extended: true}));
//application/json 제이슨 타입을 분석해서 가져오기 
app.use(bodyParser.json());



app.get("/", (req,res) => {
    const newUser = new User();
    newUser.email = "interface@naver.com";
    newUser.name = "interface";
    newUser.age = 11;
    newUser
    .save()
    .then((user)=>{
        console.log(user);
        res.json({
            message:'User created'
        });
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            message: 'User not created.'
        });
    });
 });

 
app.get('/finddata',(req,res)=>{//요청에서 검색할 기준을 Pivot으로 받음
    console.log("get data with keyword")
    //req.body는 다음과 같음.
    /*
    {
        "Pivot": "{\"<검색할 태그>\" : <태그의 값>}"
    }
    */
    Pivot = JSON.parse(req.body.Pivot);
    //전달받은 정보를 JSON형식으로 변환
    
    User.findOne(Pivot, function(err, User){
        if(err){
            console.log(err);
        }else if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
            res.json(null);
        }else{
            console.log(User);
            res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    })
    return res;
})

//application/x-ww-form-urlencoded 요렇게 생긴 데이터를 분석해서 가져올 수 있도록


