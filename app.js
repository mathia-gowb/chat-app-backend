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
    console.log("connected")
    socket.on('NEW_MESSAGE',(data)=>{
        //add the new data to database then when successful reload the 
        console.log(data)
    })
})
app.get('/api',(req,res)=>{
    //access the database
    //this project uses mongoose local db 
    res.json({"chats":" adf" })
})
app.post('/admin',(req,res)=>{
    res.json({"response":"you made request as admin"})
})
app.post('/public',(req,res)=>{
    const user=req.query.name;
    /* check if the current user exists */
    const message=new messages({
        clientName:user,
        messages:[{
            messageContent:req.query.message,
            sender:{
                senderName:user,
                admin:false,
            }
        }]
    })
    message.save()
    .then(data=>{
        res.json({"response":"ngelekanyo you made request to public",redirect:"/public/messages"})
    })
    /* fetch all their message and return them in json with the newuser of false */
})
server.listen(5000,()=>{console.log("Server started on port 5000")})