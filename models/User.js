const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    
    firstname: {
        type: String,
        required: true
    
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true
    },
    place: {
        type: String
    },
    password: String,
    date: {
        type: Date, 
        default: Date.now
    },
                
});

// module.exports = 
mongoose.model('user', UserSchema);
