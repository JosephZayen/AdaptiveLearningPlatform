//TODO: 如果说两个类相互依赖，初始化的时候需要引用彼此的方法，要怎么办
export class ControlPlaneWidget {
    // DOM elements (first)
    newChatBtn;
    newMessageFrameBtn;
    reasoningSelectTag;
    // dependency injection (second)
    setModelReasoning;
    addMsgFrame;
    highlightSidebarItem;
    appendSidebarItem;
    addEmptyChat;
    fetchNewChatId;
    setActiveChatId;
    renderChat;
    SYSTEM_MESSAGE_OBJECT;
    constructor(options) {
        this.newChatBtn = options.newChatBtn;
        this.newMessageFrameBtn = options.newMessageFrameBtn;
        this.reasoningSelectTag = options.reasoningSelectTag;
    }
    init(options) {
        //init configs
        const APIConfigs = options.API;
        this.setModelReasoning = APIConfigs.setModelReasoning.bind(APIConfigs);
        const dataConfigs = options.dataConfigs;
        this.SYSTEM_MESSAGE_OBJECT = dataConfigs.SYSTEM_MESSAGE_OBJECT;
        //init messages widget
        const messagesArea = options.messagesArea;
        this.addMsgFrame = messagesArea.addMsgFrame.bind(messagesArea);
        this.renderChat = messagesArea.renderChat.bind(messagesArea);
        //init sidebar widget
        const sidebar = options.sidebar;
        this.highlightSidebarItem = sidebar.highlightSidebarItem.bind(sidebar);
        this.appendSidebarItem = sidebar.appendSidebarItem.bind(sidebar);
        //init store object
        const store = options.store;
        this.addEmptyChat = store.addEmptyChat.bind(store);
        this.setActiveChatId = store.setActiveChatId.bind(store);
        //init network object
        const network = options.network;
        this.fetchNewChatId = network.fetchNewChatId.bind(network);
        this.controlPlaneInit();
    }
    controlPlaneInit() {
        //初始化控制面板的监听器
        return new Promise((resolve) => {
            //初始化新聊天按钮的监听器
            const newChatBtn = this.newChatBtn;
            newChatBtn.addEventListener("click", async (ev) => {
                const target = ev.target;
                if (target.closest("#new-chat")) {
                    this.addChat();
                }
            });
            //初始化新消息框的监听器
            const newMessageFrameBtn = this.newMessageFrameBtn;
            newMessageFrameBtn.addEventListener("click", (ev) => {
                const btn = ev.target;
                if (btn.closest("#new-message-frame")) {
                    this.addMsgFrame("user", "");
                }
            });
            //初始化模型参数选择器的监听器
            const reasoningSelector = this.reasoningSelectTag;
            reasoningSelector.addEventListener("change", (ev) => {
                const rs = ev.target;
                if (rs.closest("#reasoning-selector")) {
                    this.setModelReasoning(rs.getAttribute("value") || "disabled");
                }
            });
            resolve(null);
        });
    }
    async addChat() {
        const chatId = await this.fetchNewChatId();
        this.addEmptyChat(chatId, this.SYSTEM_MESSAGE_OBJECT);
        this.setActiveChatId(chatId);
        this.appendSidebarItem(chatId);
        this.highlightSidebarItem();
        this.renderChat();
    }
}
//# sourceMappingURL=controlPlaneWidget.mjs.map