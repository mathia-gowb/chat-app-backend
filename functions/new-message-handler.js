const handleNewMessage= function (data,messageDocument,IO_Object){
    const currTime=new Date()
    let messageFormat={
        messageContent:data.message,
         isAdmin:data.admin,
         isUnRead:data.isUnRead,
         messageTime:currTime
    }

    messageDocument.findOneAndUpdate({chatId:data.chatId},{$push:{messages:messageFormat},chatTime:new Date()},{ returnOriginal: false},(err,chat)=>{
        if(err){
            console.log(err)
        }else{
            IO_Object.emit('RETURNED_MESSAGES',chat)
        }
    })
}
module.exports = handleNewMessage;