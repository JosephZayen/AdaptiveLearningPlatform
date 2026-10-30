
export interface SidebarInterface {
    getActiveChatId;
    setActiveChatId;
    renderChat;
    sidebar;
    //methods
    init(options): void;
    clearSidebar(): void;
    appendSidebarItem(chatId: number): void;
    sidebarListenerInit(): void;
    highlightSidebarItem(): void;
}