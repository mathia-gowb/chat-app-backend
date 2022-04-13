const express=require('express');
const app=express();
const messages=require('./models/messages')
const mongoose=require('mongoose');
const http=require("http");
const {Server}=require("socket.io");
const cors=require("cors");

app.use(cors())
/* Connect to mongoDb */
mongoose.connect('mongodb://localhost/chatapp');
mongoose.connection.once('open',function(){
    console.log('connected to the database');
}).on('error',function(error){
    console.log(error)
})
/* configure socket.io */
const server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});
io.on("connection",(socket)=>{
    /* this will be called when a new user initiate a chart */
    socket.on('NEW_CHAT',(data)=>{
        //add the message to the database
       const user=data.name;
       /* check if the current user exists */
       const message=new messages({
           clientName:user,
           messages:[{
               messageContent:data.message,
                isAdmin:false,
           }]
       })
       message.save()
       .then(data=>{
           /* the new message event will provide the chat id to the front end and the event will cal the get messages which will return all the messages in that chat */
           io.emit('INITIATE_PRIVATE_CHART',{chatId:data._id});
           io.emit('DETECT_NEW_MESSAGE',{chatId:data._id});
       })

    });
    socket.on('NEW_MESSAGE',(data)=>{
        //find and update that chat
        handleNewMessage(data);
    })
    socket.on('NEW_ADMIN_MESSAGE',(data)=>{

    })
    socket.on('GET_MESSAGES',(data)=>{
        //the GET_MESSAGES  is fired and it gets all the messages using the id of the prop
        messages.findById(data.chatId)
        .then(chat=>{
            if(chat){
                io.emit('RETURNED_MESSAGES',chat.messages)
            }
        })
    })
      //return the message object
      //send the instruction to reload the charts list on admin(set users id to object id) & to redirect the user(set id to object id) to /messages

})
app.get('/api',(req,res)=>{
    //access the database
    //this project uses mongoose local db 
    res.json({"chats":" adf" })
})
app.post('/admin',(req,res)=>{
    res.json({"response":"you made request as admin"})
})
function handleNewMessage(data){
    let messageFormat={
        messageContent:data.message,
         isAdmin:data.admin,
    }
    messages.findByIdAndUpdate(data.chatId,{$push:{messages:messageFormat}},(err,chat)=>{
        if(err){
            console.log(err)
        }else{
            io.emit('RETURNED_MESSAGES',chat.messages)
        }
    })
    
}
server.listen(5000,()=>{console.log("Server started on port 5000")})