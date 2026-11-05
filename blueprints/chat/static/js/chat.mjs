import { BoardWidget } from "./boardWidget.mjs";
import { NetworkWidget } from "./networkWidget.mjs";
import { parseChats } from "./mappers.mjs";
import { API, dataConfigs, macro } from "./configs.mjs";
import { MessagesAreaWidget } from "./messagesAreaWidget.mjs";
import { StoreWidget } from "./storeWidget.mjs";
import { SidebarWidget } from "./sidebarWidget.mjs";
import { InputAreaWidget } from "./inputWidget.mjs";
import { ControlPlaneWidget } from "./controlPlaneWidget.mjs";
document.addEventListener("DOMContentLoaded", () => {
    //DOMContentLoaded starts
    const sidebarNode = document.getElementById("sidebar-chats");
    const messagesAreaNode = document.getElementById("messages");
    const inputBtnNode = document.getElementById("input-submit");
    const textAreaNode = document.getElementById("input-content");
    const controlPlaneNode = document.getElementById("control-plane");
    const newChatBtn = document.getElementById("new-chat");
    const newMessageFrameBtn = document.getElementById("new-message-frame");
    const reasoningSelectTag = document.getElementById("reasoning-selector");
    //初始化各个控件对象
    //APIConfigs, storeWidget, networkWidget, mappersWidget, messagesAreaWidget, sidebarWidget, controlPlaneWidget, inputWidget
    const store = new StoreWidget();
    const network = new NetworkWidget();
    const sidebar = new SidebarWidget(sidebarNode);
    //input 
    const inputOptions = { inputBtn: inputBtnNode, textArea: textAreaNode };
    const inputWidget = new InputAreaWidget(inputOptions);
    //messages
    const messagesOptions = { messagesArea: messagesAreaNode, getMsgEditor: (msgId) => {
            return messagesAreaNode.querySelector(`[data-msg-id]=${msgId}`)?.querySelector(".message-editor");
        } };
    const messagesWidget = new MessagesAreaWidget(messagesOptions);
    const board = new BoardWidget();
    const controlPlaneOptions = { newChatBtn: newChatBtn,
        newMessageFrameBtn: newMessageFrameBtn,
        reasoningSelectTag: reasoningSelectTag
    };
    const controlPlane = new ControlPlaneWidget(controlPlaneOptions);
    const options = {
        messagesArea: messagesWidget,
        API: API,
        macro: macro,
        dataConfigs: dataConfigs,
        store: store,
        network: network,
        sidebar: sidebar,
        controlPlane: controlPlane
    };
    store.init(options);
    messagesWidget.init(options);
    network.init(options);
    sidebar.init(options);
    inputWidget.init(options);
    board.init(options);
    controlPlane.init(options);
    // DOMContentLoaded end
});
//# sourceMappingURL=chat.mjs.map