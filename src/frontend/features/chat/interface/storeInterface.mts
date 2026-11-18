interface msgObject {
    role: "system" | "assistant" | "user";
    content: string;
}

export interface Data { 
    [index: number]: {
        "msg-order": number[];
        "msg-dict": {
            [index: number]: msgObject;
        }
    };
}

export interface MsgOrder { 
    [index: string]: object;
}


export interface StoreInterface {
    //注意这里只对给外部的接口进行约束，以进行校验，但是内部状态的定义反而会增加复杂度
    //所以内部的状态约束注释掉

    /*
    activeChatId: number;
    data: data;
    */

    // methods
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