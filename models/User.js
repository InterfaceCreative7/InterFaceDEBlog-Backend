const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userSchema = new Schema ({//제목 본문 태그 표지이미지 날짜 작성자, required 필요부분?
    title: {
        type: String,
        required:true
    },
    blogBody :  {type : String, default : ''},
    tag: {type: String, default : '' },
    imageUrl: {type : String, default : 'https://www.google.com'},
    writedate: { type: Date, default: Date.now },
    writername: String
},
{
    timestamps: true
}
);
const User =  mongoose.model('User', userSchema);
module.exports = { User }
//user model 만들고 exports해줌