import type {storeInterface, data} from "./interface/storeInterface.ts"
 

export class StoreWidget implements storeInterface {
    data!: storeInterface["data"];
    activeChatId!: storeInterface["activeChatId"];

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

    init(options: object){}

    setData(newData: storeInterface["data"]){
        this.data = newData;
    }

    getData(){
        return this.data;
    }

    //数据层：给活跃chat的末尾添加一个空的message
    addMsg(chatId: number, role: string, inputText: string){ 
        const msgOrder = this.getMsgOrder(chatId);
        const msgDict = this.getMsgDict(chatId);
        //推入新消息顺序
        const lastId = msgOrder?.at(-1);
        const newMsgId = lastId === undefined ? 0 : lastId + 1;
        msgOrder.push(newMsgId);
        //推入新消息数据 
        msgDict[newMsgId] = this.createRoleMessage(role, inputText ? inputText.trim() : "");
    }

    editMsg(chatId: number, msgId: number, newText: string){
        const msgDict = this.getMsgDict(chatId);
        msgDict[msgId] = this.createUserMessage(newText);
    }

    //数据层：添加一个新的带有systemMessage对象（{role: ... content ...}）的chat
    addEmptyChat(chatId: number, systemMessage: object){
        const msgOrder = [0];
        const msgDict = {0 : systemMessage};
        this.data[chatId] = {"msg-order": msgOrder, "msg-dict": msgDict};
    }

    //------------------------------------------------------------------

    getOrderAndDict(chatId: number){
        return [this.getMsgOrder(chatId), this.getMsgDict(chatId)];
    }

    getChat(chatId: number) {
        return this.data[chatId] as object;
    }

    getMsgOrder(chatId: number){
        const chat = this.getChat(chatId) as object;
        return chat["msg-order"];
    }

    getMsgDict(chatId: number){
        const chat = this.getChat(chatId) as object;
        return chat["msg-dict"];
    }

    //------------------------------------------------------------------

    setActiveChatId(chatId: number){
        this.activeChatId = chatId;
    }

    getActiveChatId(){
        return this.activeChatId;
    }

    //------------------------------------------------------------------

    createUserMessage(content: string){
        return this.createRoleMessage("user", content ?? "");
    }

    createSystemMessage(content: string){
        return this.createRoleMessage("system", content ?? "");
    }

    createRoleMessage(role: string, content: string){
        const valid = ["user", "system", "assistant"];
        if(valid.includes(role)){
            return {"role": role, "content": content ? String(content) : ""};
        } else {
            return {"role": "user", "content": content ? String(content) : ""};
        }
    }
}