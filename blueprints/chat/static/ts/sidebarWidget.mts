import type {SidebarInterface} from "./interface/sidebarInterface.mjs";
import type {Options} from "./interface/optionsInterface.mjs";

//TODO: 搞清楚JS是不是必须写初始化，然后搞懂models里面的继承机制干了什么，为什么没写init也可以，还有super(js)
export class SidebarWidget implements SidebarInterface{  
    getActiveChatId: any;
    setActiveChatId: any;
    renderChat: any;
    sidebar: HTMLElement;
    
    constructor(sidebarNode){
        this.sidebar = sidebarNode;
    }

    init(options: Options){
        const store = options.store;
        this.getActiveChatId = store.getActiveChatId.bind(store);
        this.setActiveChatId = store.setActiveChatId.bind(store);
        const messagesArea = options.messagesArea;
        this.renderChat = messagesArea.renderChat.bind(messagesArea);
    }
    
    clearSidebar(){
        this.sidebar.innerHTML = "";
    }

    //插一个chatId的span标签到顶部
    appendSidebarItem(chatId){
        const chatSpan = document.createElement("span");
        chatSpan.dataset.chatId = chatId;
        chatSpan.textContent = chatId;
        chatSpan.classList.add("sidebar-item");
        this.sidebar.insertAdjacentElement("afterbegin", chatSpan);
    }

    sidebarListenerInit(){
        this.sidebar.addEventListener("click", (ev)=>{
            if(ev.target instanceof Element){
                const chatItem: HTMLElement = ev.target.closest(".sidebar-item") as HTMLElement;
                if(chatItem){
                    const chatId = chatItem.dataset.chatId;
                    this.setActiveChatId(chatId);
                    this.highlightSidebarItem();
                    this.renderChat();
                }
            }
        });
    }

    highlightSidebarItem(){
        const activeChatId = this.getActiveChatId();
        Array.from(this.sidebar.children).forEach((n)=>{
            n.classList.toggle("active", (n as HTMLElement).dataset.chatId === activeChatId);
        });
    }
}
