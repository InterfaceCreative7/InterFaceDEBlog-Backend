const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); //1105

//application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

app.listen(port, ()=>console.log("listening on port: " + port +"\t http://localhost:"+ port));

app.get('/',(req,res)=>{res.send("hello world!")});

app.post('/register', (req, res) => {
    //node react inflearn 강의7_ 4 : 12 참고
// 필요한 정보들을 client에서 가져오면 그것들을 디비에 넣어줌. 


})