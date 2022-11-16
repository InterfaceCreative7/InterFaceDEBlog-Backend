const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const {User} = require('./models/User');
const { Comment } = require('./models/Comment.js');
const config = require('./config');
const req = require("express/lib/request");
const { json } = require("body-parser");
const cors = require('cors')

app.listen(port, ()=>console.log("listening on port: " + port +"\t http://localhost:"+ port));
//app.get('/',(req,res)=>{res.send("hello world!")});
//페이지 열었을시 나오는 문구
mongoose.connect(config.mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("mongoDB connected..."));


//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())
app.post('/',(req,res)=>{
    res.json("connected!");
})
//Comment
app.post("/about/comments/upload",(req,res)=>{//커멘트를 DB에 저장함. 또다른 스키마 Comment를 사용
    const newComment = new Comment();
    newComment.body = req.body.body;
    newComment.writername = req.body.writername;
    newComment.dataType = "comment";

    newComment
    .save()//comment를 저장하고
    .then((comment)=>{
        console.log(comment);//성공하면
        res.json({
            message:'Comment created'
        });
        console
    })
    .catch((err)=>{//실패하면
        console.log(err);
        res.json({
            message: 'Comment not created.'
        });
    });

});

app.get("/about/comments/findall/:title/:value",(req,res)=>{

    let title = req.params.title;
    let value = req.params.value;

    pi = { [title]: value};//전달받은 정보를 사용해 JSON타입의 데이터를 만듦
    console.log(pi);
    if(title == undefined || value == undefined){//req에서 정확하게 입력받았는지 확인한다.
        console.log("incorrect formet");//둘 중 하나라도 undefined, 즉 올바르지 못하다면 find를 실행하지 않는다.
        res.json(null);
    }
    else{
        Comment.find(pi, function(err, comment){
            
            if(err){
                console.log(err);
            }else if(comment[0] == null){
                console.log("no such data");//데이터를 찾지 못하면 null을 전송함
                res.json(null);
            }else{
                console.log("find");
                console.log(comment);
                res.json(comment);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
            }
            //return res;
        })
    }
})
app.delete('/about/comments/clear',async (req,res)=>{
    Comment.deleteMany({},(err, User)=>{//req에서 _id값을 받아옴.
        if(err){
            console.log(err);
            res.json(err);
        }else if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
            res.json(null);
        }else{
            console.log(User);
            res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    });
})
app.delete('/about/comments/delete/:_id',async (req,res)=>{
    Comment.findByIdAndDelete(req.params._id,(err, User)=>{//req에서 _id값을 받아옴.
        if(err){
            console.log(err);
            res.json(err);
        }else if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
            res.json(null);
        }else{
            console.log(User);
            res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    });
})
//User
app.post("/posts/upload", (req,res) => {//새로운 post를 만드는 기능이므로 post메소드를 이용한다.
    const newUser = new User();
    newUser.title = req.body.title;
    newUser.blogBody = req.body.blogBody;
    newUser.tag = req.body.teg;
    newUser.imageUrl = req.body.imageUrl;
    newUser.writername = req.body.writername;
    newUser.dataType = "User";
    newUser
    .save()
    .then((user)=>{
        console.log(user);
        res.json({
            message:'Post created'
        });
        console
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            message: 'Post not created.'
        });
    });
 });

 //몇몇의 메소드에서 사용될 함수이므로 따로 만들어 주었다.
let findAll = async (req, res)=> {//요청에서 검색할 기준을 Pivot으로 받음
    console.log("get data with keyword")
    //req.body는 다음과 같음.
    /*
    {
        "title":<검색할 키값>
        "value":<검색할 내용>
    }
    */
    let pi;
    let title = req.param('title');
    let value = req.param('value');
    pi = { [title]:value};//전달받은 정보를 사용해 JSON타입의 데이터를 만듦
 
    if(title == undefined ||value == undefined){//req에서 정확하게 입력받았는지 확인한다.
        console.log(title);//둘 중 하나라도 undefined, 즉 올바르지 못하다면 find를 실행하지 않는다.
        res.json("errer");
    }
    else{
        User.find(pi)
        .then((User)=>{
            
            if(User[0] == null){
                console.log("no such data");//데이터를 찾지 못하면 null을 전송함
                res.json(null);
            }else{
                console.log("find");
                console.log(User);
                res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
            }
            //return res;
        })
        .catch((err)=>{
            console.log(err);
            res.json(err);
        })
    }
}
app.get('/posts/findall',findAll);//원하는 post를 찾는 기능이므로 get메소드를 사용함.
//application/x-ww-form-urlencoded 요렇게 생긴 데이터를 분석해서 가져올 수 있도록

app.patch('/posts/modify', async (req,res)=>{//특정 post를 수정하는 기능이므로 put메소드를 사용함.
   
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
        {new : true}
    )
    .then((User)=>{//설정된 태그의 값을 바꿈. 
            if(!User){
                console.log("no such data");//데이터를 찾지 못하면 null을 전송함
                res.json(null);
            }else{
                console.log(User);
                res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json(err);
    })
})

app.delete('/posts/delete', async (req,res)=>{//id값을 받아서 자료를 삭제하는 기능이므로 delete메소드를 사용함.
    console.log("delete");
    if(req.body._id == undefined)
        return res.json("wrongKey");
    else{
    User.deleteOne({"_id":req.body._id})
    .then((err, User)=>{//req에서 _id값을 받아옴.
        if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
            res.json(null);
        }else{
            console.log(User);
            res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json(err);
    })
}
})

app.delete('/posts/clear',async (req,res)=>{
    User.deleteMany({})
    .then((err, User)=>{//req에서 _id값을 받아옴.
        if(!User){
            console.log("no such data");//데이터를 찾지 못하면 null을 전송함
            res.json(null);
        }else{
            console.log(User);
            res.json(User);//찾았다면 해당 정보의 전체를 json 형식으로 전달함
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json(err);
    })
})

let add = function(i){
    const newUser = new User();
    newUser.title = i.toString();
    newUser.blogBody = i.toString() + 100;
    newUser.writername = i.toString() + 200;
    newUser
    .save()
}
app.post('/test/add100',async (req,res)=>{
    for(i = 0; i < 100; i++){
        add(i);
    }
    res.json(null);
})


