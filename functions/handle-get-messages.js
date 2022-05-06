function handleGetMessages(data,IO_Object,messageDocument){
    messageDocument.findOne({chatId:data.chatId})
    .then(chat=>{
        if(chat){
           handleGetMessagesHelper(IO_Object,data,chat)
        }
    })
}
//determines which event to emit based on whether the request was sent from admin sidebar or front page
function handleGetMessagesHelper(IO_Object,data,chatObject){
    if(data.role==='getFirstChatMessages'){
        IO_Object.emit('RETURNED_MESSAGES',chatObject)
        return
    }else{
        //if not first chat get messages for chat clicked in frontend
        IO_Object.emit('MESSAGES_FOR_CURRENT_CHAT',{messages:chatObject.messages,chatName:chatObject.clientName})
    }
}
module.exports = handleGetMessages