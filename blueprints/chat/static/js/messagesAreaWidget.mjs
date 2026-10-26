//TODO： 这里如果循环引用会怎么样



export class MessagesArea{
    constructor(options){
        this.messagesArea = options.messagesArea;
        this.getMsgEditor = options.getMsgEditor ?? this.getMsgEditor;
        const store = options.store;
        this.getActiveChatId = store.getActiveChatId;
        this.getChat = store.getChat;
        this.getMsgDict = store.getMsgDict;
        this.getMsgOrder = store.getMsgOrder;
        this.addMsg = store.addMsg;
    }

    //创建新的消息框，只是DOM，不涉及内存
    createMessageFrame(content){

        /*  TODO
            读一下伪元素那块，看懂下面这句话：
            placeholder：contenteditable 没有原生 placeholder，用 :empty::before { content: attr(data-placeholder) }
        */
        const newMessageFrame = document.createElement("div");
        newMessageFrame.className = "message-frame";

        //  复习一下relative, absolute定位，把下面这块搞好

        const msgControlArea = document.createElement("div");
        msgControlArea.className = "message-control-area";
        newMessageFrame.appendChild(msgControlArea);

        const msgEditBtn = document.createElement("button");
        msgEditBtn.className = "message-edit-btn";
        msgEditBtn.textContent = "edit";
        msgControlArea.appendChild(msgEditBtn);

        const msgDeleteBtn = document.createElement("button");
        msgDeleteBtn.className = "message-delete-btn";
        msgDeleteBtn.textContent = "del";
        msgControlArea.appendChild(msgDeleteBtn);

        const msgEditor = document.createElement("div");
        msgEditor.className = "message-editor";
        msgEditor.setAttribute("contenteditable", "false");
        msgEditor.textContent = content ?? "";
        newMessageFrame.appendChild(msgEditor);
        return newMessageFrame;
    }

    //创建消息框的监听器，包括编辑和删除监听器
    messagesAreaInit(){
        this.messagesArea.addEventListener("click", (ev)=>{
            //我这ev.target没错吧
            //没错，result应该是个特殊的属性
            const target = ev.target;
            const msgFrame = target.closest(".message-frame");
            if(msgFrame){
                const msgId = parseInt(msgFrame.dataset.msgId);
                const editNode = target.closest(".message-edit-btn");
                const delNode = target.closest(".message-delete-btn");
                if(editNode){
                    const editor = editNode?.querySelector("message-editor");
                    if(editNode.dataset.editing && editNode.dataset.editing === "true"){
                        msgEditHandler(this.getActiveChatId(), msgId);
                        editNode.dataset.editing === "false";
                        editor.setAttribute("contenteditable", "false");
                    } else {
                        editNode.dataset.editing === "true";
                        editor.setAttribute("contenteditable", "true");
                    }
                } else if(delNode){
                    msgDeleteHandler(this.getActiveChatId(), msgId);
                }
            }
        });
    }   

    //处理消息框编辑事件
    msgEditHandler(chatId, msgId){
        //这用到了CSS属性选择器，看一下CSS权威指南第二章
        const msgEditor = this.getMsgEditor(msgId);
        this.editMsg(chatId, msgId, msgEditor.textContent);
        this.renderChat();
    }

    getMsgEditor(msgId){
        return this.messagesArea.querySelector(`[data-msg-id]=${msgId}`)?.querySelector(".message-editor");
    }

    //处理消息框删除事件
    //没调修改的API
    msgDeleteHandler(chatId, msgId){
        const chat = this.getChat(chatId);
        const msgDict = this.getMsgDict(chatId);
        const msgOrder = this.getMsgOrder(chatId);
        delete msgDict[msgId];
        const newOrder = msgOrder.filter((x)=>{x != msgId});
        chat["chat-order"] = newOrder;
        this.renderChat();
    }
    
    //给活跃聊天添加新消息， 这里只改内存状态
    addMsgFrame(role, content){
        this.addMsg(this.getActiveChatId(), role, content);
        this.renderChat();
    }

    //通过顺序渲染活跃的聊天，只改DOM（不传chatId）
    renderChat(){
        this.messagesArea.innerHTML = "";
        const activeChatId = this.getActiveChatId();
        const msgOrder = this.getMsgOrder(activeChatId);
        const msgDict = this.getMsgDict(activeChatId);
        const fragment = document.createDocumentFragment();
        msgOrder.forEach((msgId)=>{
            const msg = msgDict[msgId];
            const msgFrame = this.createMessageFrame(msg["content"]); //msg["role"]这样的
            fragment.appendChild(msgFrame);
        })
        this.messagesArea.appendChild(fragment);
    }

    /*
        JOB:
            还差new chat， 修改聊天消息， 删除聊天消息， 
    */
}