


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

}

//如何数字转字符串
//String()函数用法，number.toString用法，隐式转换



