const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const {User} = require('./models/User');
const config = require('./config');


app.listen(port, ()=>console.log("listening on port: " + port +"\t http://localhost:"+ port));
//app.get('/',(req,res)=>{res.send("hello world!")});
//페이지 열었을시 나오는 문구

mongoose.connect(config.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("mongoDB connected..."));

//**bodyparser options **/
app.use(bodyParser.urlencoded({extended: true}));
//application/json 제이슨 타입을 분석해서 가져오기 
app.use(bodyParser.json());
//application/x-ww-form-urlencoded 데이터를 분석해서 가져오기



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
        res.json({
            message: 'User not created.'
        });
    });
 });

 //회원가입을 위한 라우터
 app.post('/register', (req,res) => {

    //회원가입시 필요 정보를 client에서 가져오면 그걸 디비에 넣어줌

    const user = new User(req.body) //making instance

    user.save((err,userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })    
      })
    })

 
 
   




