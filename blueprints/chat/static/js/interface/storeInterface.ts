export interface data { 
    [index: number]: object;
}

export interface msgOrder { 
    [index: string]: object;
}


export interface storeInterface {
    activeChatId: number;
    data: data;
    // methods
    init: (options: any) => void;
    setData: (newData: data) => void;
    getData: () => data;
    addMsg: (chatId: number, role: string, inputText: string) => void;
    editMsg: (chatId: number, msgId: number, newText: string) => void;
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