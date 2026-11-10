//TODO： 这里如果循环引用会怎么样
export class MessagesAreaWidget {
    //
    messagesArea;
    //依赖注入
    getActiveChatId;
    getData;
    setData;
    getChat;
    getMsgDict;
    getMsgOrder;
    addMsg;
    clearSidebar;
    appendSidebarItem;
    editMsg;
    store;
    network;
    constructor(options) {
        this.messagesArea = options.messagesArea;
        this.getMsgEditor = options.getMsgEditor ?? this.getMsgEditor;
    }
    init(options) {
        const store = options.store;
        this.store = store;
        const sidebar = options.sidebar;
        this.clearSidebar = sidebar.clearSidebar.bind(sidebar);
        this.appendSidebarItem = sidebar.appendSidebarItem.bind(sidebar);
        const network = options.network;
        this.network = network;
    }
    //创建新的消息框，只是DOM，不涉及内存
    /**
     * @coupling #messages
     * @level HIGH
     * @reason 动态 HTML 插入，JS 依赖 DOM 结构及选择器
     * @impact HTML 与 JS 结构变更需要同步维护
     * @action 修改前检查双方依赖关系
     * @todo 后续解耦
     *
     * @structure
     *  messages-frame
     *      -message-control-area 控制区域
     *          -message-edit-btn
     *          -message-delete-btn
     *      -message-editor 编辑真实文本
     *
     */
    createMessageFrame(msgId, content) {
        /*  TODO
            读一下伪元素那块，看懂下面这句话：
            placeholder：contenteditable 没有原生 placeholder，用 :empty::before { content: attr(data-placeholder) }
        */
        const newMessageFrame = document.createElement("div");
        newMessageFrame.className = "message-frame";
        newMessageFrame.dataset.msgId = String(msgId);
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
        const msgEditor = document.createElement("textarea");
        msgEditor.className = "message-editor";
        msgEditor.setAttribute("contenteditable", "false");
        msgEditor.textContent = content ?? "";
        msgEditor.readOnly = true;
        newMessageFrame.appendChild(msgEditor);
        return newMessageFrame;
    }
    //创建消息框的监听器，包括编辑和删除监听器
    messagesAreaInit() {
        this.messagesArea.addEventListener("click", (ev) => {
            //我这ev.target没错吧
            //没错，result应该是个特殊的属性
            const target = ev.target;
            const msgFrame = target.closest(".message-frame");
            if (msgFrame) {
                const msgId = parseInt(msgFrame.dataset.msgId);
                const editBtn = target.closest(".message-edit-btn");
                const delBtn = target.closest(".message-delete-btn");
                if (editBtn) {
                    const editor = msgFrame.querySelector(".message-editor");
                    if (editBtn.dataset.editing && editBtn.dataset.editing === "true") {
                        this.msgEditHandler(this.store.getActiveChatId(), msgId);
                        editBtn.dataset.editing = "false";
                        editor.readOnly = true;
                    }
                    else {
                        editBtn.dataset.editing = "true";
                        editor.readOnly = false;
                    }
                }
                else if (delBtn) {
                    this.msgDeleteHandler(this.store.getActiveChatId(), msgId);
                }
            }
        });
    }
    //处理消息框编辑事件
    msgEditHandler(chatId, msgId) {
        //这用到了CSS属性选择器，看一下CSS权威指南第二章
        const msgEditor = this.getMsgEditor(msgId);
        this.store.editMsg(chatId, msgId, msgEditor.value);
        console.log("log");
        console.log(this.store.getMsgDict(chatId));
        this.network.updateChat(chatId);
        this.renderChat();
    }
    getMsgEditor(msgId) {
        return this.messagesArea.querySelector(`[data-msg-id="${msgId}"]`)?.querySelector(".message-editor");
    }
    //处理消息框删除事件
    //没调修改的API
    msgDeleteHandler(chatId, msgId) {
        this.store.deleteMsg(chatId, msgId);
        this.network.updateChat(chatId);
        this.renderChat();
    }
    //给活跃聊天添加新消息， 这里只改内存状态
    addMsgFrame(role, content) {
        this.store.addMsg(this.store.getActiveChatId(), role, content);
        this.network.updateChat(this.store.getActiveChatId());
        this.renderChat();
    }
    //通过顺序渲染活跃的聊天，只改DOM（不传chatId）
    renderChat() {
        this.messagesArea.innerHTML = "";
        const activeChatId = this.store.getActiveChatId();
        const msgOrder = this.store.getMsgOrder(activeChatId);
        const msgDict = this.store.getMsgDict(activeChatId);
        const fragment = document.createDocumentFragment();
        msgOrder.forEach((msgId) => {
            const msg = msgDict[msgId];
            const msgFrame = this.createMessageFrame(msgId, msg["content"]); //msg["role"]这样的
            fragment.appendChild(msgFrame);
        });
        this.messagesArea.appendChild(fragment);
    }
}
//# sourceMappingURL=messagesAreaWidget.mjs.map