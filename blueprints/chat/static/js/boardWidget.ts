


//我想读取配置文件，符合DRY原则，减小代码复杂度，但是这个JS运行在浏览器环境里面，咋办
//webpack打包

export class BoardWidget {
    constructor () {

    }

    init (options) {
        //APIConfigs, store, network, mappers, messagesArea, sidebarWidget, controlPlaneWidget, inputWidget
        const store = options.store;
        this.setData = storeWidget.setData;
        const network = options.network;
        this.requestChats = networkWidget.requestChats;
        const mappers = options.mappers;
        this.parseChats = mappersWidget.parseChats;
        const messagesArea = options.messagesArea;
        this.loadFromData = messagesAreaWidget.loadFromData;
    }

    /*
        这是初始化前端的逻辑，用来拉取数据，然后对前端进行初始化，
        这个阶段需要构建数据对象的基础，然后渲染边栏，并且渲染一个初始的聊天

        拉取数据只进行一次，之后只需更新即可
    */

    async loadFromBackEnd () {
        return new Promise((resolve)=>{
            //拉取所有聊天数据，加载到this.data里面
            const params = new URLSearchParams();
            params.append("local_date", this.todayStr);
            const response = this.requestChats(params);
            response.then((responseObject)=>{
                if(responseObject.status === this.SUCCESS){
                    const newData = this.parseChats(responseObject.content);
                    this.setData(newData);
                    //LOG ----------------------------------------------------------------------------------------
                    console.log(chats);
                    console.log(typeof chats);
                    console.log(chats);
                } else {
                    //TODO 这里怎么加重试啊
                    this.setData({});
                    console.error("RESPONSE STATUS ERROR");
                    throw new Error("response status error");
                }
                this.loadFromData();
                resolve();
            })
        })
    }
}

//如何数字转字符串
//String()函数用法，number.toString用法，隐式转换



