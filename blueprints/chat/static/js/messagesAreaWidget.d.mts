import type { MessagesAreaInterface } from "./interface/messagesInterface.mjs";
import type { Options } from "./interface/optionsInterface.mjs";
export declare class MessagesAreaWidget implements MessagesAreaInterface {
    messagesArea: any;
    getActiveChatId: any;
    getData: any;
    setData: any;
    getChat: any;
    getMsgDict: any;
    getMsgOrder: any;
    addMsg: any;
    clearSidebar: any;
    appendSidebarItem: any;
    editMsg: any;
    store: Options["store"];
    constructor(options: any);
    init(options: Options): void;
    loadFromData(): void;
    clearMessagesArea(): void;
    createMessageFrame(content: any): HTMLDivElement;
    messagesAreaInit(): void;
    msgEditHandler(chatId: any, msgId: any): void;
    getMsgEditor(msgId: any): any;
    msgDeleteHandler(chatId: any, msgId: any): void;
    addMsgFrame(role: any, content: any): void;
    renderChat(): void;
}
//# sourceMappingURL=messagesAreaWidget.d.mts.map