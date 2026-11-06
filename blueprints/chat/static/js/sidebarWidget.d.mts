import type { SidebarInterface } from "./interface/sidebarInterface.mjs";
import type { Options } from "./interface/optionsInterface.mjs";
export declare class SidebarWidget implements SidebarInterface {
    getActiveChatId: any;
    setActiveChatId: any;
    renderChat: any;
    sidebar: HTMLElement;
    constructor(sidebarNode: any);
    init(options: Options): void;
    clearSidebar(): void;
    appendSidebarItem(chatId: any): void;
    sidebarListenerInit(): void;
    highlightSidebarItem(): void;
}
//# sourceMappingURL=sidebarWidget.d.mts.map