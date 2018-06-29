const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TokenSchema = new Schema({
    
    _userId: {
        type: String,
        required: true,
        ref: 'user'                   //userschema name from usermodel
    
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required:true, 
        default: Date.now,
        expires: 43200
    }
                
});

mongoose.model('Token', TokenSchema);
module.exports = Token;



// var mongoose=require('mongoose');
// var schema = new mongoose.Schema({
//     _userId: { type:String, required: true, ref: 'User' },
//     token: { type: String, required: true },
//     createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
// });
// var Token=mongoose.model('Token',schema);
// module.exports=Token;


