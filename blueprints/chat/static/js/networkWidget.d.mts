import type { NetworkInterface } from "./interface/networkInterface.mjs";
import type { Options } from "./interface/optionsInterface.mjs";
export declare class NetworkWidget implements NetworkInterface {
    NEW_CHAT_PATH: any;
    ASK_AI_PATH: any;
    SUCCESS: any;
    getOrderAndDict: any;
    todayStr: any;
    UPDATE_PATH: any;
    constructor();
    init(options: Options): void;
    fetchNewChatId(): Promise<any>;
    askai(chatId: any, reasoningEffort: any): Promise<any>;
    requestChats(params: any): Promise<any>;
    updateChat(chatId: any): Promise<void>;
}
//# sourceMappingURL=networkWidget.d.mts.map