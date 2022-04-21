
const handleNewMessage= function (data,messageDocument,IO_Object){
    let messageFormat={
        messageContent:data.message,
         isAdmin:data.admin,
    }
    messageDocument.findByIdAndUpdate(data.chatId,{$push:{messages:messageFormat}},{ returnOriginal: false },(err,chat)=>{
        if(err){
            console.log(err)
        }else{
            console.log(chat,'the last logged object is the message_______--------');
            IO_Object.emit('RETURNED_MESSAGES',chat.messages)
        }
    })
}
module.exports = handleNewMessage;