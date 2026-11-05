import type { MessagesAreaInterface } from "./interface/messagesInterface.mjs";
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
    constructor(options: any);
    init(options: any): void;
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