const sidebar = document.getElementById("chat-sidebar");
const messages = document.getElementById("messages");
let chatSessions = null;


//我想读取配置文件，符合DRY原则，减小代码复杂度，但是这个JS运行在浏览器环境里面，咋办
//webpack打包

document.addEventListener("DOMContentLoaded", async ()=>{
})

//这是错的，我改了HTML结构
inputArea.addEventListener((ev)=>{
    const btn = ev.target.closest(".input-button");
    const inputTarget = document.querySelector(".inputarea");
    if(target){
        const prompt = inputTarget.getAttribute("value");
    }
});


class Board {
    constructor (sidebar, messagesArea, inputBtn, textArea, controlPlane, systemPromptContent) {
        //控件
        this.sidebar = sidebar;
        this.messagesArea = messagesArea;
        this.inputBtn = inputBtn;
        this.textArea = textArea;
        this.controlPlane = controlPlane; 
        this.newChatBtn = controlPlane.querySelector("#new-chat");
        this.reasoningSelectTag = controlPlane.querySelector("#reasoning-selector");
        this.newMessageFrameBtn = controlPlane.querySelector("new-message-frame");
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
        const today = new Date()
        const localDate = `${today.getFullYear()}-${parseInt(today.getFullMonth()+1).padStart(2, "0")}-${parseInt(today.getDate()).padStart(2, "0")}`;
        this.todayStr = localDate;
        //几个API路径
        //更新聊天，拉取所有聊天，获取AI回答
        this.API_BASE_PATH = "/chat/api/";
        this.UPDATE_PATH = API_BASE_PATH + "update";
        this.READSESSIONS_PATH = API_BASE_PATH + "read-sessions";
        this.ASKAI_PATH = API_BASE+PATH + "askai";
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
            params.append("local_date", localDate);
            const responseObject = await requestChats(params);
            if(responseObject.status === SUCCESS){
                const chats = responseObject.content;
                for(let i = 0; i < chats.length; i++){
                    const chat = chats[i];
                    const chatId = chat["chat_id"];
                    const chatJson = chat["chat_json"];
                    this.data[chatId] = chatJson;
                }
            } else {
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
                this.active = chatId;
                highlightSidebarItem(this.activeChatId);
                renderChat(this.activeChatId);
            }
        });
    }

    highlightSidebarItem(chatId){
        this.sidebar.childNodes.forEach((n)=>{
            n.classList.toggle("active", n.dataset.chatId === chatId);
        });
    }

    renderChat(chatId){
        //清空聊天框
        this.messagesArea.innerHTML = "";
        //获取聊天对象数据，然后渲染
        const chat = this.data[chatId];
        const msgs = chat["chat_json"];
        /* JOB: 这里需要改渲染逻辑, messageFrame那种 */
        msgs.forEach((msg)=>{
            const p = document.createElement("p");
            p.textContent = `${msg["role"]}:\n\n${msg["content"]}`;
            this.messagesArea.appendChild(p);
        })
    }

    /*
        TODO:
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
                    const chatId = await this.fetchNewChatId();
                    this.data[chatId] = JSON.strinify(this.SYSTEM_MESSAGE_OBJECT);
                    this.active = chatId;
                    this.appendSidebarItem(chatId);
                    this.highlightSidebarItem(chatId);
                    this.renderChat(chatId);
                }
            });
            //初始化新消息框的监听器
            const newMessageFrameBtn = this.newMessageFrameBtn;
            newMessageFrameBtn.addEventListener("click", (ev)=>{
                const btn = ev.target.closest("#new-message-frame");
                if(btn){
                    const newMessageFrame = this.createMessageFrame();
                    this.messagesArea.appendChild(newMessageFrame);
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


    createMessageFrame(){
        /*  读一下伪元素那块，看懂下面这句话：
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
            if(responseObject.status === SUCCESS){
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
            const msgId = msgFrame.dataset.msgId;
            if(target.closest(".message-edit-btn")){
                msgEditHandler(msgId);
            } else if(target.closest(".message-delete-btn")){
                msgDeleteHandler(msgId);
            }
        });
    }   

    msgEditHandler(msgId){}

    msgDeleteHandler(msgId){}

    

    inputAreaInit(){}
    


    

    askai(messages) {
        const reasoningEffort = this.reasoningSelectTag.getAttribute("name");
        return fetch(`FETCH_PATH`, {
            method: "POST",
            body: JSON.stringify({
                "messages": messages,
                "reasoning": reasoningEffort
            })
        })
        .then((res)=> res.json())
        .then((responseObject)=>{
            if(responseObject.status === SUCCESS){
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



