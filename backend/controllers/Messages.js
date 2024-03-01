const messagesModel = require('../models/GymMesseges');
const PrivateMessagesModel=require('../models/PrivateMessage')
const messageHandler = (socket, io)=>{
    socket.on('messageGym', (data)=>{
        data.success = true;
        data.type = "Gym";
        socket.to("room-"+ data.room).emit("messageGym", data);
        socket.emit('messageGym', data);
        const newMessage = new messagesModel({
            gymId : data.from,
            planName : data.room,
            messages : [{from : data.from, room: data.room,name : data.name , image : data.image,message : data.message, image_message : data.image_message}]
        });
        messagesModel.findOne({gymId: data.from, planName: data.room}).then((result) => {
            if(result){
                messagesModel.findOneAndUpdate(
                    { gymId: data.from, planName: data.room },
                    { $push: { messages: [{from : data.from, room: data.room,name : data.name ,image : data.image,message : data.message, image_message : data.image_message}] } }, // Push data.message into messages array
                    { new: true, upsert: true }
                ).then((result) => {
                    console.log("data add in database=>", result);
                }).catch((err) => {
                    console.log("data error =>", err);
                });
            }else{
                newMessage.save().then(async(result) => {
                    console.log("data add in database=>", result);
                }).catch((err) => {
                    console.log("data error =>", err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });

    });
    
    socket.on('messagePrivate', (data)=>{
        console.log(data);
        data.success = true;
        data.type = "Private";
        socket.to("room-"+ data.room).emit("messagePrivate", data);
        socket.emit('messagePrivate', data);
        const newPrivateMessage = new PrivateMessagesModel({
            coach_id : data.from,
            user_id : data.room,
            messages : [{
                from : data.from, 
                room: data.room,
                name : data.name ,
                 image : data.image,
                 message : data.message,
                image_message : data.image_message}]
        });
        PrivateMessagesModel.findOne({coach_id: data.from, user_id: data.room}).then((result) => {
            if(result){
                PrivateMessagesModel.findOneAndUpdate(
                    { coach_id: data.from, user_id: data.room },
                    { $push: { messages: [{
                        from : data.from, room: data.room,name : data.name ,image : data.image, message : data.message, image_message : data.image_message}] } }, // Push data.message into messages array
                    { new: true, upsert: true }
                ).then((result) => {
                    console.log("data add in database=>", result);
                }).catch((err) => {
                    console.log("data error =>", err);
                });
            }else{
                newPrivateMessage.save().then(async(result) => {
                    console.log("data add in database=>", result);
                }).catch((err) => {
                    console.log("data error =>", err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    })
}

module.exports = messageHandler