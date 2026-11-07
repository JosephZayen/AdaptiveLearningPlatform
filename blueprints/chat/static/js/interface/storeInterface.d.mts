interface msgObject {
    role: "system" | "assistant" | "user";
    content: string;
}
export interface Data {
    [index: number]: {
        "msg-order": number[];
        "msg-dict": {
            [index: number]: msgObject;
        };
    };
}
export interface MsgOrder {
    [index: string]: object;
}
export interface StoreInterface {
    init: (options: any) => void;
    setData: (newData: Data) => void;
    getData: () => Data;
    addMsg: (chatId: number, role: string, inputText: string) => void;
    editMsg: (chatId: number, msgId: number, newText: string) => void;
    deleteMsg: (chatId: number, msgId: number) => void;
    addEmptyChat: (chatId: number, systemMessage: object) => void;
    getOrderAndDict: (chatId: number) => Array<object>;
    getChat: (chatId: number) => object;
    getMsgOrder: (chatId: number) => object;
    getMsgDict: (chatId: number) => object;
    setActiveChatId: (chatId: number) => void;
    getActiveChatId: () => number;
    createUserMessage: (content: string) => void;
    createSystemMessage: (content: string) => void;
    createRoleMessage: (role: string, content: string) => void;
}
export {};
//# sourceMappingURL=storeInterface.d.mts.map