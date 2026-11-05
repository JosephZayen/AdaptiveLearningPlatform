import type { NetworkInterface } from "./interface/networkInterface.mjs";
export declare class NetworkWidget implements NetworkInterface {
    NEW_CHAT_PATH: any;
    ASK_AI_PATH: any;
    SUCCESS: any;
    getOrderAndDict: any;
    constructor();
    init(options: any): void;
    fetchNewChatId(): Promise<any>;
    askai(chatId: any, reasoningEffort: any): Promise<any>;
    requestChats(params: any): Promise<any>;
    updateChat(): void;
}
//# sourceMappingURL=networkWidget.d.mts.map