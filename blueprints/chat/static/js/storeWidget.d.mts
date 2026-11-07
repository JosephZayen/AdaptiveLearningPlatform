import type { StoreInterface } from "./interface/storeInterface.mjs";
export declare class StoreWidget implements StoreInterface {
    data: any;
    activeChatId: any;
    constructor();
    init(options: any): void;
    setData(newData: object): void;
    getData(): {};
    addMsg(chatId: number, role: string, inputText: string): void;
    editMsg(chatId: number, msgId: number, newText: string): void;
    deleteMsg(chatId: number, msgId: number): void;
    addEmptyChat(chatId: number, systemMessage: object): void;
    getOrderAndDict(chatId: number): any[];
    getChat(chatId: number): object;
    getMsgOrder(chatId: number): any;
    getMsgDict(chatId: number): any;
    setActiveChatId(chatId: number): void;
    getActiveChatId(): any;
    createUserMessage(content: string): {
        role: string;
        content: string;
    };
    createSystemMessage(content: string): {
        role: string;
        content: string;
    };
    createRoleMessage(role: string, content: string): {
        role: string;
        content: string;
    };
}
//# sourceMappingURL=storeWidget.d.mts.map