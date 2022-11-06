const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required:true
    },
    name: String, 
    age: {
      type: Number,
     
    }
},
{
    timestamps: true
}
);
const User =  mongoose.model('User', userSchema);
module.exports = { User }
//user model 만들고 exports해줌