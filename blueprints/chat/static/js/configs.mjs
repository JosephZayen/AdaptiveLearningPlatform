

class APIConfigs{
    constructor(){
        //给API new-chat/read-sessions的日期
        const today = new Date();
        const localDate = this.dateToStr(today);
        this.todayStr = localDate;

        const API_BASE_PATH = "/chat/api/";
        this.API_BASE_PATH = API_BASE_PATH;

        this.UPDATE_PATH = API_BASE_PATH + "update";
        this.READSESSIONS_PATH = API_BASE_PATH + "read-sessions";
        this.ASKAI_PATH = API_BASE_PATH + "askai";
        this.NEW_CHAT_PATH = API_BASE_PATH + "new-chat";
    }

    dateToStr(today){
        return `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    }
}

class DataConfigs{
    constructor(){
        //提示词系统对象，初始化新聊天的时候挂载上去
        this.SYSTEM_MESSAGE_OBJECT = {"role": "system", "content": systemPromptContent};
    }
}

class MacroConfigs {
    constructor(){
        //状态码
        this.FAILURE = 1
        this.SUCCESS = 0
        //默认模型参数
        this.modelReasoning = "disabled";
    }
}

const API = new APIConfigs();
const DATA_CONFIGS = new DataConfigs();
const Macro = new MacroConfigs();