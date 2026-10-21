


//我想读取配置文件，符合DRY原则，减小代码复杂度，但是这个JS运行在浏览器环境里面，咋办
//webpack打包

export class Board {
    constructor (sidebar, messagesArea, inputBtn, textArea, controlPlane, systemPromptContent) {
        //控件
        this.sidebar = sidebar;
        this.messagesArea = messagesArea;
        this.inputBtn = inputBtn;
        this.textArea = textArea;
        this.controlPlane = controlPlane; 
        this.newChatBtn = controlPlane.querySelector("#new-chat");
        this.reasoningSelectTag = controlPlane.querySelector("#reasoning-selector");
        this.newMessageFrameBtn = controlPlane.querySelector("#new-message-frame");
        /**
         * controlArea
         *  #new-chat
         *  #reasoning-selector
         *  #new-message-frame
         * 然后把几个子控件挂载到对象上
         */
        //状态码
        this.FAILURE = 1
        this.SUCCESS = 0
        //默认模型参数
        this.modelReasoning = "disabled";
        //日期挂载到this.todayStr里面
        const today = new Date();
        const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        this.todayStr = localDate;
        //几个API路径
        //更新聊天，拉取所有聊天，获取AI回答
        const API_BASE_PATH = "/chat/api/";
        this.API_BASE_PATH = API_BASE_PATH;
        this.UPDATE_PATH = API_BASE_PATH + "update";
        this.READSESSIONS_PATH = API_BASE_PATH + "read-sessions";
        this.ASKAI_PATH = API_BASE_PATH + "askai";
        this.NEW_CHAT_PATH = API_BASE_PATH + "new-chat";
        //提示词系统对象，初始化新聊天的时候挂载上去
        this.SYSTEM_MESSAGE_OBJECT = {"role": "system", "content": systemPromptContent};
        //整个前端的本质是一个chatId与数据的键值对，反映它的状态，方便数据的提取
        this.data = {};
    }

    /*
        这是初始化前端的逻辑，用来拉取数据，然后对前端进行初始化，
        这个阶段需要构建数据对象的基础，然后渲染边栏，并且渲染一个初始的聊天

        拉取数据只进行一次，之后只需更新即可
    */

    async init () {
        return new Promise(async (resolve)=>{
            //拉取所有聊天数据，加载到this.data里面
            const params = new URLSearchParams();
            params.append("local_date", this.todayStr);
            const responseObject = await this.requestChats(params);
            if(responseObject.status === this.SUCCESS){
                const chats = JSON.parse(responseObject.content);
                console.log(chats);
                console.log(typeof chats);
                console.log(chats);
                for(let i = 0; i < chats.length; i++){
                    const chat = chats[i];
                    const chatId = chat["chat_id"];
                    const chatObject = {};
                    const chatOrder = [];
                    chatObject["chat-order"] = chatOrder;
                    const chatList = chat["chat_json"];
                    const chatDict = Object.fromEntries(chatList);
                    chatObject["chat-dict"] = chatDict;
                    this.data[chatId] = chatObject;
                }
            } else {
                //TODO 这里怎么加重试啊
                console.error("RESPONSE STATUS ERROR");
                this.data = {};
                throw new Error("response status error");
            }
            //清空边栏和消息的内容
            this.messagesArea.innerHTML = "";
            this.sidebar.innerHTML = "";
            //挂载this.data中的chats到边栏
            for (const chatId of Object.keys(this.data)){
                this.appendSidebarItem(chatId);
            }
            resolve();
        })
    }
    
    requestChats(params){
        return fetch(`/chat/api/read-sessions?${params}`, {
            method: "GET"
        })
        .then(
            (response)=>{
                if(!response.ok){
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return response.json();
            }
        )
    }

    appendSidebarItem(chatId){
        const chatSpan = document.createElement("span");
        chatSpan.dataset.chatId = chatId;
        chatSpan.textContent = chatId;
        this.sidebar.appendChild(chatSpan);
    }

    sidebarListenerInit(){
        this.sidebar.addEventListener("click", (ev)=>{
            const chatItem = ev.target.closest(".sidebar-item");
            if(chatItem){
                const chatId = chatItem.dataset.chatId;
                this.activeChatId = chatId;
                this.highlightSidebarItem();
                this.renderChat();
            }
        });
    }

    highlightSidebarItem(){
        this.sidebar.childNodes.forEach((n)=>{
            n.classList.toggle("active", n.dataset.chatId === this.activeChatId);
        });
    }

    renderChat(){
        //清空聊天框
        this.messagesArea.innerHTML = "";
        //获取聊天对象数据，然后渲染
        const chatObject = this.data[this.activeChatId];
        const orders = chatObject["chat-order"];
        const msgsDict = chatObject["chat-dict"];
        /* JOB: 这里需要改渲染逻辑, messageFrame那种 */
        const fragment = document.createDocumentFragment();
        orders.forEach((order)=>{
            const msg = msgsDict[order];
            const msgFrame = this.createMessageFrame()
            msgFrame.textContent = msg["content"]; //msg["role"]这样的
            fragment.appendChild(msgFrame);
        })
        this.messagesArea.appendChild(fragment);
        //TODO 这语法对吗
    }

    /*
        JOB:
            还差new chat， 修改聊天消息， 删除聊天消息， 
    */

    controlPlaneInit(){
        //初始化控制面板的监听器
        return new Promise((resolve)=>{
            //初始化新聊天按钮的监听器
            const newChatBtn = this.newChatBtn;
            newChatBtn.addEventListener("click", async (ev)=>{
                const target = ev.target.closest("#new-chat");
                if(target){
                    this.addChat();
                }
            });
            //初始化新消息框的监听器
            const newMessageFrameBtn = this.newMessageFrameBtn;
            newMessageFrameBtn.addEventListener("click", (ev)=>{
                const btn = ev.target.closest("#new-message-frame");
                if(btn){
                    this.addMsgFrame();
                }
            });
            //初始化模型参数选择器的监听器
            const reasoningSelector = this.reasoningSelectTag;
            reasoningSelector.addEventListener("change", (ev)=>{
                const rs = ev.target.closest("#reasoning-selector");
                if(rs){
                    this.modelReasoning = rs.getAttribute("value") | "disabled";
                }
            })
            resolve();
        });
    } 

    async addChat(){
        const chatId = await this.fetchNewChatId();
        const chatObject = {};
        const chatOrder = [0];
        chatObject["chat-order"] = chatOrder;
        const chatDict = {};
        chatDict[0] = this.SYSTEM_MESSAGE_OBJECT;
        chatObject["chat-dict"] = chatDict;
        this.data[chatId] = chatObject;
        this.activeChatId = chatId;
        this.appendSidebarItem(chatId);
        this.highlightSidebarItem();
        this.renderChat();
    }

    addMsgFrame(){
        //这里只改内存状态
        const chat = this.data[this.activeChatId];
        const chatOrder = chat["chat-order"];
        const chatDict = chat["chat-dict"];
        const lastId = chatOrder.at(-1);
        const newMsgId = lastId === undefined ? 0 : lastId + 1;
        chatOrder.push(newMsgId);
        //TODO: 重构成静态方法，拆分成几个子类
        chatDict[newMsgId] = this.createEmptyUserMessage();
        //JSON.stringify(this.createEmptyUserMessage()); 改了这个错代码，以前是用的JSON里面写的，结果好像导致序列化出错了，但是为什么呢？
        //重新渲染
        this.renderChat();
    }

    createEmptyUserMessage(){
        return {"role": "user", "content": ""};
    }


    createMessageFrame(){
        
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
        newMessageFrame.appendChild(msgEditor);
        return newMessageFrame;
    }

    fetchNewChatId(){
        return fetch(this.NEW_CHAT_PATH, {
            method: "POST",
            body: null
        })
        .then(
            (resp) => resp.json()
        )
        .then((responseObject)=>{
            if(responseObject.status === this.SUCCESS){
                return responseObject.content;
            } else {
                throw new Error("status code error");
            }
        })
        .catch((reason)=>{
            console.error("fetch new chat error: ");
            console.error(reason);
            throw reason;
        });

        /*TODO 
            这里的错误处理怎么样，返回值呢

            错误处理就靠传导就行，.then里面的reject再throw出来就行，如果不throw也会默认传出来
            console.error可以靠默认实现打印错误

            确实是这样，会自动透传，但是如果reject里面正常返回了就完了，fulfill了
        */
    }

    messagesAreaInit(){
        const messagesArea = this.messagesArea;
        messagesArea.addEventListener("click", (ev)=>{
            //  我这ev.target没错吧
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
                        msgEditHandler(msgId);
                        editNode.dataset.editing === "false";
                        editor.setAttribute("contenteditable", "false");
                    } else if(editNode.dataset.editing && editNode.dataset.editing === "false"){
                        editNode.dataset.editing === "true";
                        editor.setAttribute("contenteditable", "true");
                    } else {
                        editNode.dataset.editing === "false";
                        editor.setAttribute("contenteditable", "false");
                    }
                } else if(delNode){
                    msgDeleteHandler(msgId);
                }
            }
        });
    }   

    msgEditHandler(msgId){
        //这用到了CSS属性选择器，看一下CSS权威指南第二章
        const msgEditor = this.getMsgEditor(msgId);
        const activeChat = this.data[this.activeChatId];
        const emptyUserMsg = this.createEmptyUserMessage();
        emptyUserMsg["content"] = msgEditor?.textContent;
        //这里我塞进去的是对象，初始化的时候，response.json()拿到的
        activeChat["chat-dict"][msgId] = emptyUserMsg;
        this.renderChat();
    }

    getMsgEditor(msgId){
        return this.messagesArea.querySelector(`[data-msg-id]=${msgId}`)?.querySelector(".message-editor");
    }

    //没调修改的API
    msgDeleteHandler(msgId){
        const activeChat = this.data[this.activeChatId];
        delete activeChat["chat-dict"][msgId];
        //undefined的行为是什么
        const newOrder = activeChat["chat-order"]?.filter((x)=>{x != msgId});
        activeChat["chat-order"] = newOrder ? newOrder : activeChat["chat-order"];
        this.renderChat();
    }

    /**
     * 我可以用数组来反映消息的状态，也可以用对象，前者好处就是直接添加容易，缺点是删除复杂，因为删除了一个消息岂不是说其它的要重新赋值ID？序列变了，这样耦合程度太高。如果是集合，删除容易，添加麻烦，因为不知道最大的序列，所以还需要一个对象来保存
     * 
     * 
     * AI的解决办法是直接用一个数组来存顺序，确实，因为每次我重新排其实就是在算这个列表，从小到大，那直接维护就好了，每次重新渲染时间复杂度只需要O(n)，如果是我之前那个即时算的办法就是O(nlog(n))
     */

    async inputAreaInit(){
        this.inputBtn.addEventListener("click", (ev)=>{
            if(ev.target.closest("#input-submit")){
                this.inputHandler();
            }
        })
    }

    //推个新的数据到内存里面，然后渲染，调用AI回复的周期
    //我这里其实没写修改的
    inputHandler(){
        const inputText = this.textArea.value;
        if(inputText){
            const activeChat = this.data[this.activeChatId];
            const lastId = activeChat["chat-order"]?.at(-1);
            const newChatId = lastId === undefined ? 0 : lastId + 1;
            activeChat["chat-order"].push(newChatId);
            const newUserMessage = this.createEmptyUserMessage();
            newUserMessage["content"] = inputText.trim();
            activeChat["chat-dict"][newChatId] = newUserMessage;
            this.renderChat();
            this.getRenderResponse();
        }
    }

    //拿回AI回复数据，然后加数据（内存）
    async getRenderResponse(){
        const responseText = await this.askai();
        const activeChat = this.data[this.activeChatId];
        const lastId = activeChat["chat-order"]?.at(-1);
        const newChatId = lastId === undefined ? 0 : lastId + 1;
        activeChat["chat-order"].push(newChatId);
        const newUserMessage = this.createEmptyUserMessage();
        newUserMessage["content"] = responseText.trim();
        activeChat["chat-dict"][newChatId] = newUserMessage;
        this.renderChat();
    }
    

    askai() {
        const messages = [];
        const activeChat = this.data[this.activeChatId];
        const chatOrder = activeChat["chat-order"];
        const chatDict = activeChat["chat-dict"];
        chatOrder.forEach((chatId)=>{
            messages.push(chatDict[chatId]);
        });
        const reasoningEffort = this.reasoningSelectTag.getAttribute("name");
        console.log(messages);
        console.log(JSON.stringify({
                "messages": messages,
                "reasoning": reasoningEffort
            }));
        return fetch(this.ASKAI_PATH, {
            method: "POST",
            body: JSON.stringify({
                "messages": messages,
                "reasoning": reasoningEffort
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res)=> res.json())
        .then((responseObject)=>{
            if(responseObject.status === this.SUCCESS){
                const responseText = responseObject.content;
                return responseText;
            }else {
                throw new Error("askai status failed");
            }
        })
        .catch((reason)=>{
            console.error("askai error: ");
            console.error(reason);
        });
    }
}

//如何数字转字符串
//String()函数用法，number.toString用法，隐式转换



