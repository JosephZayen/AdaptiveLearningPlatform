export interface MessagesAreaInterface {

    /*
    //依赖DOM
    messagesArea;

    //依赖注入
    getActiveChatId;
    getData;
    setData;
    getChat;
    getMsgDict;
    getMsgOrder;
    addMsg;
    clearSidebar;
    appendSidebarItem;
    editMsg;
    */

    //方法
    init;
    loadFromData;
    clearMessagesArea;
    createMessageFrame;
    messagesAreaInit;
    msgEditHandler;
    getMsgEditor;
    msgDeleteHandler;
    addMsgFrame;
    renderChat;
}