const mongoose=require('mongoose');
const Schema=mongoose.Schema;
/* 
database 1 => messages
{
  clientName:'name of person on front end',
  clientId:'id of person who initiated the chat'
  chatId:"adjfkalsdfjka" -> id which will be entered when the user on the front of the website send first message only
  messages:[
    {
      messageContent:'lorem ipsum something',
      sender:{
        senderName:'Mathobo Ngelekanyo',
        Admin:true
      },
      messageTime:Date Object
    }
  ]
}
*/
const userSchema=new Schema({
    clientName:String,
    clientId:String,
    chatId:String,
    messages:Array

})

const User=mongoose.model("user",userSchema);
module.exports=User;