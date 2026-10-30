//接收后端返回的JSON数据(read-sessions api)，返回可用的data


export function parseChats(jsonChats){
    try {
        const chats = JSON.parse(jsonChats);
        const data = {}
        for(let i = 0; i < chats.length; i++){
            const chat = chats[i];
            const chatId = chat["chat_id"];
            const msgDict = JSON.parse(chat["msg_dict"]);
            // [msgId : {"role": "user", "content": ""}, ...]
            const msgOrder = Object.keys(msgDict).sort();
            data[chatId] = {"msg-dict": msgDict, "msg-order": msgOrder};
        }
        return data;
    }
    catch (e) {
        console.error("parse Chats error: ");
        console.error(e);
        throw e;
    }
} 