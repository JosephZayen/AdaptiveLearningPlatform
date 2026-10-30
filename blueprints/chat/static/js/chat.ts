import {BoardWidget} from "./boardWidget.js";
import {NetworkWidget} from "./networkWidget.mjs";
import {parseChats} from "./mappersWidget.mjs";
import {API, dataConfigs, macro} from "./configs.mjs";
import {MessagesAreaWidget} from "./messagesAreaWidget.mjs";
import {StoreWidget} from "./storeWidget.mjs";
import {SidebarWidget} from "./sidebarWidget.mjs";
import {InputAreaWidget} from "./inputWidget.mjs";

document.addEventListener("DOMContentLoaded", async ()=>{

const sidebarNode = document.getElementById("sidebar-chats");
const messagesAreaNode = document.getElementById("messages");
const inputBtnNode = document.getElementById("input-submit");
const textAreaNode = document.getElementById("input-content");
const controlPlaneNode = document.getElementById("control-plane");

//初始化各个控件对象
//APIConfigs, storeWidget, networkWidget, mappersWidget, messagesAreaWidget, sidebarWidget, controlPlaneWidget, inputWidget

const store = new Store();
const network = new NetworkWidget();

const sidebarOptions = {sidebarNode: sidebarNode};
const sidebar = new SidebarWidget();

const inputOptions = {inputBtn: inputBtnDOM, textArea: textAreaDOM};
const inputWidget = new inputAreaWidget(inputOptions);

const messagesOptions = {messagesArea: messagesAreaDOM, getMsgEditor: (msgId)=>{
    return this.messagesArea.querySelector(`[data-msg-id]=${msgId}`)?.querySelector(".message-editor");
}};
const messagesWidget = new messagesAreaWidget(messagesOptions);

const board = new BoardWidget();
})
