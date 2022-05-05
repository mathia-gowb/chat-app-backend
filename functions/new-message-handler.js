const handleNewMessage= function (data,messageDocument,IO_Object){
    let messageFormat={
        messageContent:data.message,
         isAdmin:data.admin,
         isUnRead:data.isUnRead
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