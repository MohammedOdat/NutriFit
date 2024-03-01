const mongoose = require("mongoose");

const messagesModel = new mongoose.Schema({
    gymId : {type : Number},
    planName : {type : String},
    messages: [{
    from : {type : Number},
    room : {type : String},
    name : {type : String},
    image : {type : String},
    message : { type: String },
    image_message : {type : String, default : null},
    created_at : { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model("MessagesGym", messagesModel);