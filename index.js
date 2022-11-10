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


//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());





app.get("/", (req,res) => {
    const newUser = new User();
    newUser.title = "interface";
    newUser.blogBody;
    newUser.tag;
    newUser.imageUrl;
    newUser.writedate; 
    newUser.writername = "interface";
    newUser
    .save()
    .then((user)=>{
        console.log(user);
        res.json({
            message:'Blog created'
        });
        console
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            message: 'Blog not created.'
        });
    });
 });
app.get('/about',(req,res)=>{
     res.send("about page")});


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
    let pi;
    
    pi = { [req.key]: req.value};//전달받은 정보를 사용해 JSON타입의 데이터를 만듦
    console.log(pi);
    if(req.body.key == undefined || req.body.value == undefined){//req에서 정확하게 입력받았는지 확인한다.
        console.log("incorrect formet");//둘 중 하나라도 undefined, 즉 올바르지 못하다면 find를 실행하지 않는다.
        res.json(null);
    }
    else{
        User.find(pi, function(err, User){
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
app.post('/findall',findAll);
//application/x-ww-form-urlencoded 요렇게 생긴 데이터를 분석해서 가져올 수 있도록

/*
app.post('/modify', (req,res)=>{//id와 수정할 정보의 키, 벨류를 받아 수정한다.
    console.log(req.body.mod);
    
    User.updateMany({"_id":req.body._id},{$set: {"age" : 91}},(err, User)=>{//설정된 태그의 값을 바꿈. req에서 태그와 값을 받는 것으로 바꾸어줄 예정
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
*/
app.post('/modify', async (req,res)=>{
   
    /*
    body 형식
    {
        _id: <해당 데이터의 _id>,
        mod:{
            <바꾸고 싶은 항목의 key> : <바꾸고 싶은 항목의 value>,
            <바꾸고 싶은 항목의 key> : <바꾸고 싶은 항목의 value>,
            .
            .
            .

        }
    }
    */

    if(req.body._id == undefined || req.body.mod == undefined)
        return res.json("wrongKey");
    
    User.updateOne({_id: req.body._id},
        {$set: req.body.mod},
        {new : true},
        (err, User)=>{//설정된 태그의 값을 바꿈. 
            if(err){
                console.log(err);
            }else if(!User){
                console.log("no such data");//데이터를 찾지 못하면 null을 전송함
                res.json(null);
            }else{
                console.log(User);
                res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    });
})

app.post('/delete', async (req,res)=>{//id값을 받아서 자료를 삭제함
    if(req.body._id == undefined)
        return res.json("wrongKey");
    else{
    User.deleteOne({"_id":req.body._id},(err, User)=>{//req에서 _id값을 받아옴.
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
}
})



/*
{"_id":{"$oid":"63677d7c7ec713cb3049cf4d"},"email":"interface@naver.com","name":"interface","age":{"$numberInt":"11"},"createdAt":{"$date":{"$numberLong":"1667726716115"}},"updatedAt":{"$date":{"$numberLong":"1667726716115"}},"__v":{"$numberInt":"0"}}
{"_id":{"$oid":"6367881505ec1a3d7a2eff07"},"email":"interface@naver.com","name":"inaterface","age":{"$numberInt":"13"},"createdAt":{"$date":{"$numberLong":"1667729429566"}},"updatedAt":{"$date":{"$numberLong":"1667971198634"}},"__v":{"$numberInt":"0"}}
{"_id":{"$oid":"636b9532f354f23a83798d3a"},"blogBody":"","imageUrl":"https://www.google.com","writedate":{"$date":{"$numberLong":"1667994930102"}},"title":"interface","writername":"interface","createdAt":{"$date":{"$numberLong":"1667994930108"}},"updatedAt":{"$date":{"$numberLong":"1667994930108"}},"__v":{"$numberInt":"0"}}
{"_id":{"$oid":"6367881505ec1a3d7a2eff07"},"email":"interface@naver.com","name":"inaterface","age":{"$numberInt":"13"},"createdAt":{"$date":{"$numberLong":"1667729429566"}},"updatedAt":{"$date":{"$numberLong":"1668064898935"}},"__v":{"$numberInt":"0"},"writedate":{"$date":{"$numberLong":"1668044839535"}}}
*/

