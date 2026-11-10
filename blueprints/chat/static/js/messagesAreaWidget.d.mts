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
    network: Options["network"];
    constructor(options: any);
    init(options: Options): void;
    /**
     * @coupling #messages
     * @level HIGH
     * @reason 动态 HTML 插入，JS 依赖 DOM 结构及选择器
     * @impact HTML 与 JS 结构变更需要同步维护
     * @action 修改前检查双方依赖关系
     * @todo 后续解耦
     *
     * @structure
     *  messages-frame
     *      -message-control-area 控制区域
     *          -message-edit-btn
     *          -message-delete-btn
     *      -message-editor 编辑真实文本
     *
     */
    createMessageFrame(msgId: number, content: string): HTMLDivElement;
    messagesAreaInit(): void;
    msgEditHandler(chatId: any, msgId: any): void;
    getMsgEditor(msgId: any): any;
    msgDeleteHandler(chatId: any, msgId: any): void;
    addMsgFrame(role: any, content: any): void;
    renderChat(): void;
}
//# sourceMappingURL=messagesAreaWidget.d.mts.map