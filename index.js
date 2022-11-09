const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const {User} = require('./models/User');
const config = require('./config');
const req = require("express/lib/request");
const { json } = require("body-parser");


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


 //몇몇의 메소드에서 사용될 함수이므로 따로 만들어 주었다.
let findAll = async (req, res)=> {//요청에서 검색할 기준을 Pivot으로 받음
    console.log("get data with keyword")
    //req.body는 다음과 같음.
    /*
    {
        "key":<검색할 키값>
        "value":<검색할 내용>
    }
    */
    //전달받은 정보를 JSON형식으로 변환

    let pi = "{"+ "\"" + req.body.key + "\"" + ':' + req.body.value + "}";
    if(req.body.key == undefined || req.body.value == undefined){//req에서 정확하게 입력받았는지 확인한다.
        console.log("incorrect formet");//둘 중 하나라도 undefined, 즉 올바르지 못하다면 find를 실행하지 않는다.
        res.json(null);
    }
    else{
        pi_JSON = JSON.parse(pi);//JSON형식으로 바꾸어주고
        User.find(pi_JSON, function(err, User){
            if(err){
                console.log(err);
            }else if(!User){
                console.log("no such data");//데이터를 찾지 못하면 null을 전송함
                res.json(null);
            }else{
                console.log(User);
                res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
            }
            //return res;
        })
    }
}
app.get('/findall',findAll);
//application/x-ww-form-urlencoded 요렇게 생긴 데이터를 분석해서 가져올 수 있도록

let modifyData = async (req, res)=>{

    let id = req.body._id;
    let data;
    User.updateOne({'_id':req._id}, {$set:{'age' : req.body.age}},(err, User)=>{
        console.log(req.body.age);
        if(err){
            console.log(err);
        }else if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
           
        }else{
            console.log(User);
            
        }
    });
    
    User.findById(id, (err, User)=>{
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
    /*User.updateOne({ "_id" : id }, { "age" : req.age , "email" : req.email }, (err, User)=>{
        if(err){
            console.log(err);
        }else if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
            res.json(null);
        }else{
            console.log(User);
            res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    });*/
    
}
app.get('/modify', (req,res)=>{
    User.updateOne({"_id":req.body._id},{$set: {"age" : 91}},(err, User)=>{//설정된 태그의 값을 바꿈. req에서 태그와 값을 받는 것으로 바꾸어줄 예정
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
})

/*
{"_id":{"$oid":"63677d7c7ec713cb3049cf4d"},"email":"interface@naver.com","name":"interface","age":{"$numberInt":"11"},"createdAt":{"$date":{"$numberLong":"1667726716115"}},"updatedAt":{"$date":{"$numberLong":"1667726716115"}},"__v":{"$numberInt":"0"}}
*/

