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

module.exports = mongoose.model('User', userSchema);
//user model aksemfa