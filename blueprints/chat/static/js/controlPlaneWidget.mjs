
 
//TODO: 如果说两个类相互依赖，初始化的时候需要引用彼此的方法，要怎么办

class ControlPlane{
    constructor(options){
        this.newChatBtn = options.newChatBtn;
        this.newMessageFrameBtn = options.newMessageFrameBtn;
        this.reasoningSelectTag = options.reasoningSelectTag;
    }

    init(options){
        //init configs
        const APIConfigs = options.API;
        this.setModelReasoning = APIConfigs.setModelReasoning;
        //init messages widget
        const messagesArea = options.messagesArea;
        this.addMsgFrame = messagesArea.addMsgFrame;
        //init sidebar widget
        const sidebar = options.sidebar;
        this.highlightSidebarItem = sidebar.highlightSidebarItem;
        this.appendSidebarItem = sidebar.appendSidebarItem;
        //init store object
        const store = options.store;
        this.addEmptyChat = store.addEmptyChat;
        //init network object
        const network = options.network;
        this.fetchNewChatId = network.fetchNewChatId;
        this.controlPlaneInit();
    }

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
                    this.addMsgFrame("user", "");
                }
            });
            //初始化模型参数选择器的监听器
            const reasoningSelector = this.reasoningSelectTag;
            reasoningSelector.addEventListener("change", (ev)=>{
                const rs = ev.target.closest("#reasoning-selector");
                if(rs){
                    this.setModelReasoning(rs.getAttribute("value") || "disabled");
                }
            })
            resolve();
        });
    }

    async addChat(){
        const chatId = await this.fetchNewChatId();
        this.addEmptyChat(chatId, this.SYSTEM_MESSAGE_OBJECT);
        this.activeChatId = chatId;
        this.appendSidebarItem(chatId);
        this.highlightSidebarItem();
        this.renderChat();
    }
}