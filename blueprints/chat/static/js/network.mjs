export class Network{
    constructor (){
        
    }

    init(options){
        const API = options.API;
        this.NEW_CHAT_PATH = API.NEW_CHAT_PATH;
        this.ASK_AI_PATH = API.ASKAI_PATH;

        const macroConfigs = options.macroConfigs;
        this.SUCCESS = macroConfigs.SUCCESS;

        const store = options.store;
        this.getOrderAndDict = store.getOrderAndDict;
    }
    
    fetchNewChatId(){
        return fetch(this.NEW_CHAT_PATH, {
            method: "POST",
            body: null
        })
        .then(
            (resp) => resp.json()
        )
        .then((responseObject)=>{
            if(responseObject.status === this.SUCCESS){
                return responseObject.content;
            } else {
                throw new Error("status code error");
            }
        })
        .catch((reason)=>{
            console.error("fetch new chat error: ");
            console.error(reason);
            throw reason;
        });
    }


    askai(chatId, reasoningEffort) {
        const messages = [];
        const [msgOrder, msgDict] = this.getOrderAndDict(chatId);
        msgOrder.forEach((msgId)=>{
            messages.push(msgDict[msgId]);
        });
        console.log(messages);
        console.log(JSON.stringify({
                "messages": messages,
                "reasoning": reasoningEffort
            }));
        return fetch(this.ASKAI_PATH, {
            method: "POST",
            body: JSON.stringify({
                "messages": messages,
                "reasoning": reasoningEffort
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res)=> res.json())
        .then((responseObject)=>{
            if(responseObject.status === this.SUCCESS){
                const responseText = responseObject.content;
                return responseText;
            }else {
                throw new Error("askai status failed");
            }
        })
        .catch((reason)=>{
            console.error("askai error: ");
            console.error(reason);
        });
    }


    requestChats(params){
        return fetch(`/chat/api/read-sessions?${params}`, {
            method: "GET"
        })
        .then(
            (response)=>{
                if(!response.ok){
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return response.json();
            }
        )
    }


    updateChat(){}
}