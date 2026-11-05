import type { SidebarInterface } from "./interface/sidebarInterface.mjs";
export declare class SidebarWidget implements SidebarInterface {
    getActiveChatId: any;
    setActiveChatId: any;
    renderChat: any;
    sidebar: any;
    constructor(sidebarNode: any);
    init(options: any): void;
    clearSidebar(): void;
    appendSidebarItem(chatId: any): void;
    sidebarListenerInit(): void;
    highlightSidebarItem(): void;
}
//# sourceMappingURL=sidebarWidget.d.mts.map