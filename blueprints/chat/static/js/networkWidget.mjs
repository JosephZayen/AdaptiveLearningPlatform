import { mkUpdateBody } from "./mappers.mjs";
export class NetworkWidget {
    NEW_CHAT_PATH;
    ASK_AI_PATH;
    SUCCESS;
    getOrderAndDict;
    todayStr;
    UPDATE_PATH;
    constructor() {
    }
    init(options) {
        const API = options.API;
        this.NEW_CHAT_PATH = API.NEW_CHAT_PATH;
        this.ASK_AI_PATH = API.ASKAI_PATH;
        this.todayStr = API.todayStr;
        this.UPDATE_PATH = API.UPDATE_PATH;
        const macroConfigs = options.macro;
        this.SUCCESS = macroConfigs.SUCCESS;
        const store = options.store;
        this.getOrderAndDict = store.getOrderAndDict.bind(store);
    }
    fetchNewChatId() {
        return fetch(this.NEW_CHAT_PATH, {
            method: "POST",
            body: null
        })
            .then((resp) => resp.json())
            .then((responseObject) => {
            if (responseObject.status === this.SUCCESS) {
                return responseObject.content;
            }
            else {
                throw new Error("status code error");
            }
        })
            .catch((reason) => {
            console.error("fetch new chat error: ");
            console.error(reason);
            throw reason;
        });
    }
    askai(chatId, reasoningEffort) {
        const messages = [];
        const [msgOrder, msgDict] = this.getOrderAndDict(chatId);
        msgOrder.forEach((msgId) => {
            messages.push(msgDict[msgId]);
        });
        console.log(messages);
        console.log(JSON.stringify({
            "messages": messages,
            "reasoning": reasoningEffort
        }));
        return fetch(this.ASK_AI_PATH, {
            method: "POST",
            body: JSON.stringify({
                "messages": messages,
                "reasoning": reasoningEffort
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((responseObject) => {
            if (responseObject.status === this.SUCCESS) {
                const responseText = responseObject.content;
                return responseText;
            }
            else {
                throw new Error("askai status failed");
            }
        })
            .catch((reason) => {
            console.error("askai error: ");
            console.error(reason);
        });
    }
    requestChats(params) {
        return fetch(`/chat/api/read-sessions?${params}`, {
            method: "GET"
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }
            return response.json();
        });
    }
    updateChat(chatId) {
        const [chatOrder, msgDict] = this.getOrderAndDict(chatId);
        const JSONBody = mkUpdateBody(chatId, msgDict, this.todayStr);
        return fetch(this.UPDATE_PATH, {
            method: "POST",
            body: JSONBody,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
            return res.json();
        })
            .then((resJson) => {
            if (resJson.status === this.SUCCESS) { }
            else {
                throw new Error("status error");
            }
        })
            .catch((reason) => {
            console.error("error in network/updateChat");
            console.error(reason);
        });
    }
}
//# sourceMappingURL=networkWidget.mjs.map