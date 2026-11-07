export class StoreWidget {
    data;
    activeChatId;
    constructor() {
        this.data = {};
        /* 已经废弃，找到了TS的类型声明替代
        const annotation = `
            data : {
                chatId: {
                    "msg-order": [msgId, 0, 1, 3, 4...],
                    "msg-dict": {0: ..., 1: ..., 2: ...}
                },
                
            }
        `
        */
    }
    //------------------------------------------------------------------
    init(options) { }
    setData(newData) {
        this.data = newData;
    }
    getData() {
        return this.data;
    }
    //数据层：给活跃chat的末尾添加一个空的message
    addMsg(chatId, role, inputText) {
        const msgOrder = this.getMsgOrder(chatId);
        const msgDict = this.getMsgDict(chatId);
        //推入新消息顺序
        const lastId = msgOrder?.at(-1);
        const newMsgId = lastId === undefined ? 0 : lastId + 1;
        msgOrder.push(newMsgId);
        //推入新消息数据 
        msgDict[newMsgId] = this.createRoleMessage(role, inputText ? inputText.trim() : "");
    }
    editMsg(chatId, msgId, newText) {
        const msgDict = this.getMsgDict(chatId);
        msgDict[msgId] = this.createUserMessage(newText);
    }
    deleteMsg(chatId, msgId) {
        const chat = this.getChat(chatId);
        const msgDict = this.getMsgDict(chatId);
        const msgOrder = this.getMsgOrder(chatId);
        //删除字典存储
        delete msgDict[msgId];
        //删除顺序内对象
        const newMsgOrder = msgOrder.filter((x) => { return x != msgId; });
        chat["msg-order"] = newMsgOrder;
    }
    //数据层：添加一个新的带有systemMessage对象（{role: ... content ...}）的chat
    addEmptyChat(chatId, systemMessage) {
        const msgOrder = [0];
        const msgDict = { 0: systemMessage };
        this.data[chatId] = { "msg-order": msgOrder, "msg-dict": msgDict };
    }
    //------------------------------------------------------------------
    getOrderAndDict(chatId) {
        return [this.getMsgOrder(chatId), this.getMsgDict(chatId)];
    }
    getChat(chatId) {
        return this.data[chatId];
    }
    getMsgOrder(chatId) {
        const chat = this.getChat(chatId);
        return chat["msg-order"];
    }
    getMsgDict(chatId) {
        const chat = this.getChat(chatId);
        return chat["msg-dict"];
    }
    //------------------------------------------------------------------
    setActiveChatId(chatId) {
        this.activeChatId = chatId;
    }
    getActiveChatId() {
        return this.activeChatId;
    }
    //------------------------------------------------------------------
    createUserMessage(content) {
        return this.createRoleMessage("user", content ?? "");
    }
    createSystemMessage(content) {
        return this.createRoleMessage("system", content ?? "");
    }
    createRoleMessage(role, content) {
        const valid = ["user", "system", "assistant"];
        if (valid.includes(role)) {
            return { "role": role, "content": content ? String(content) : "" };
        }
        else {
            return { "role": "user", "content": content ? String(content) : "" };
        }
    }
}
//# sourceMappingURL=storeWidget.mjs.map