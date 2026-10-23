class Store {
    constructor(){
        this.data = {}

        const annotation = `
            data : {
                chatId: {
                    "msg-order": [msgId, 0, 1, 3, 4...],
                    "msg-dict": {0: ..., 1: ..., 2: ...}
                },
                
            }
        `


    }

    //------------------------------------------------------------------

    //数据层：给活跃chat的末尾添加一个空的message
    addEmptyMsg(chatId, inputText){ 
        const msgOrder = this.getMsgOrder(chatId);
        const msgDict = this.getMsgDict(chatId);
        //推入新消息顺序
        const lastId = msgOrder?.at(-1);
        const newMsgId = lastId === undefined ? 0 : lastId + 1;
        msgOrder.push(newMsgId);
        //推入新消息数据 
        msgDict[newMsgId] = this.createEmptyUserMessage(inputText ? inputText.trim() : "");
    }

    editMsg(chatId, msgId, newText){
        const msgDict = this.getMsgDict(chatId);
        msgDict[msgId] = this.createEmptyUserMessage(newText);
    }

    //数据层：添加一个新的带有systemMessage对象（{role: ... content ...}）的chat
    addEmptyChat(chatId, systemMessage){
        const msgOrder = [0];
        const msgDict = {0 : systemMessage};
        this.data[chatId] = {"msg-order": msgOrder, "msg-dict": msgDict};
    }

    //------------------------------------------------------------------

    getOrderAndDict(chatId){
        return [this.getMsgOrder(chatId), this.getMsgDict(chatId)];
    }

    getChat(chatId){
        return this.data[chatId];
    }

    getMsgOrder(chatId){
        const chat = this.getChat(chatId);
        return chat["msg-order"];
    }

    getMsgDict(chatId){
        const chat = this.getChat(chatId);
        return chat["msg-dict"];
    }

    //------------------------------------------------------------------

    setActiveChatId(chatId){
        this.activeChatId = chatId;
    }

    getActiveChatId(){
        return this.activeChatId;
    }

    //------------------------------------------------------------------

    createEmptyUserMessage(content){
        return createEmptyRoleMessage("user", content ?? "");
    }

    createEmptySystemMessage(content){
        return createEmptyRoleMessage("system", content ?? "");
    }

    createEmptyRoleMessage(role, content){
        const valid = ["user", "system"];
        if(valid.includes(role)){
            return {"role": role, "content": content ? String(content) : ""};
        } else {
            return {"role": "user", "content": content ? String(content) : ""};
        }
    }
}