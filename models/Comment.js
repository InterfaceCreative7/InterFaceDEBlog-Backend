const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userSchema = new Schema ({//제목 본문 태그 표지이미지 날짜 작성자, required 필요부분?
    body : String,
    writername: { type: String },
    date: {type: Date, default: Date.now}
},
{
    timestamps: true
}
);
const Comment=  mongoose.model('Comment', userSchema);
module.exports = { Comment }
//comment model 만들고 exports해줌