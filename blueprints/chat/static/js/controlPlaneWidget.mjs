
class ControlPlane{
    constructor(options){
        this.newChatBtn = options.newChatBtn;
        this.newMessageFrameBtn = options.newMessageFrameBtn;
        this.reasoningSelectTag = options.reasoningSelectTag;
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
        this.addEmptyChat(this.SYSTEM_MESSAGE_OBJECT);
        this.activeChatId = chatId;
        this.appendSidebarItem(chatId);
        this.highlightSidebarItem();
        this.renderChat();
    }
}