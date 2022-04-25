const express=require('express');
const app=express();
const messages=require('./models/messages')
const mongoose=require('mongoose');
const http=require("http");
const {Server}=require("socket.io");
const cors=require("cors");
const handleNewMessage =require('./functions/new-message-handler.js');

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

const handleGetMessages = require('./functions/handle-get-messages')
io.on("connection",(socket)=>{
    /* this will be called when a new user initiate a chart */
    socket.on('NEW_CHAT',(data)=>{
        //add the message to the database
       const user=data.name;
       /* check if the current user exists */
       const message=new messages({
           chatId:data.chatId,
            clientName:user,
           messages:[{
               messageContent:data.message,
                isAdmin:false,
           }]
       })
       message.save()
       .then(data=>{
           /* the new message event will provide the chat id to the front end and the event will cal the get messages which will return all the messages in that chat */
           io.emit('INITIATE_PRIVATE_CHAT',{chatId:data._id});
           io.emit('DETECT_NEW_CHAT',{messages:data.messages});
       })
    });

    socket.on('NEW_MESSAGE',(data)=>{
        //find and update that chat
        handleNewMessage(data,messages,io);
    })
    socket.on('NEW_ADMIN_MESSAGE',(data)=>{
        handleNewMessage(data,messages,io);
    })
    socket.on('GET_MESSAGES',(data)=>{
        //the GET_MESSAGES  is fired and it gets all the messages using the id of the prop
        handleGetMessages(data,io,messages)
    })
})
app.get('/chats',(req,res)=>{
    //access the database
    messages.find({},(err,allChats)=>{
        if(err){
            console.log(err)
        }else{
            res.json(allChats)
        }
    })
    //this project uses mongoose local db 
})
server.listen(5000,()=>{console.log("Server started on port 5000")})