function handleGetMessages(data,IO_Object,messageDocument){
   console.log(`current chat id is ${data.chatId}`)
    messageDocument.findOne({chatId:data.chatId})
    .then(chat=>{
        if(chat){
           handleGetMessagesHelper(IO_Object,data,chat)
        }
    })
}

function handleGetMessagesHelper(IO_Object,data,chatObject){
    if(data.role==='getFirstChatMessages'){
        IO_Object.emit('RETURNED_MESSAGES',chatObject.messages)
        return
    }else{
        IO_Object.emit('MESSAGES_FOR_CURRENT_CHAT',chatObject.messages)
    }
}
module.exports = handleGetMessages