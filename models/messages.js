const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    clientName:String,
    clientId:String,
    chatId:String,
    messages:Array,
    chatTime:Date,
})

const User=mongoose.model("user",userSchema);
module.exports=User;