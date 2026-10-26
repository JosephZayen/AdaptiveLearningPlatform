//TODO: 搞清楚JS是不是必须写初始化，然后搞懂models里面的继承机制干了什么，为什么没写init也可以，还有super(js)
class Sidebar{    
    constructor(options){
        this.sidebar = options.sidebarNode;
        const store = options.store;
        this.getActiveChatId = store.getActiveChatId;
        this.setActiveChatId = store.setActiveChatId;
        const messagesArea = options.messagesArea;
        this.renderChat = messagesArea.renderChat;
    }  

    //插一个chatId的span标签到末尾
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
                this.setActiveChatId(chatId);
                this.highlightSidebarItem();
                this.renderChat();
            }
        });
    }

    highlightSidebarItem(){
        const activeChatId = this.getActiveChatId();
        this.sidebar.childNodes.forEach((n)=>{
            n.classList.toggle("active", n.dataset.chatId === activeChatId);
        });
    }
}
