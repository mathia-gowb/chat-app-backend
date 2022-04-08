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
               sender:{
                   senderName:user,
                   admin:false,
               }
           }]
       })
       message.save()
       .then(data=>{
           /* the new message event will provide the chat id to the front end and the event will cal the get messages which will return all the messages in that chat */
            io.emit('NEW_MESSAGE',{chatId:data._id});
            io.emit('INITIATE_PRIVATE_CHART',{chatId:data._id})
       })

    })
    socket.on('GET_MESSAGES',(data)=>{
        //the GET_MESSAGES  is fired and it gets all the messages using the id of the prop
        messages.findById(data.chatId)
        .then(chat=>{
            console.log('this is the current chat...........................')
            console.log(chat)
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
//app.post('/newuser',(req,res)=>{
//    console.log(req)
//    const user=req.query.name;
//    /* check if the current user exists */
//    const message=new messages({
//        clientName:user,
//        clientId:req.query.sessionId,
//        messages:[{
//            messageContent:req.query.message,
//            sender:{
//                senderName:user,
//                admin:false,
//            }
//        }]
//    })
//    message.save()
//    .then(data=>{
//        res.json({"response":"ngelekanyo you made request to public",redirect:"/public/messages"});
//       // io.emit('RECEIVE_MESSAGE',{newMessage:true})
//    })
//    /* fetch all their message and return them in json with the newuser of false */
//})

server.listen(5000,()=>{console.log("Server started on port 5000")})