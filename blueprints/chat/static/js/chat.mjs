import {Board} from "./Board.mjs"



document.addEventListener("DOMContentLoaded", async ()=>{

const sidebar = document.getElementById("sidebar-chats");
const messagesArea = document.getElementById("messages");
const inputBtn = document.getElementById("input-submit");
const textArea = document.getElementById("input-content");
const controlPlane = document.getElementById("control-plane");
const systemPromptContent = "你是一个AI聊天助手";

const board = new Board(sidebar, messagesArea, inputBtn, textArea, controlPlane, systemPromptContent);
window.__board = board;

board.init();
board.controlPlaneInit();
board.messagesAreaInit();
board.inputAreaInit();

})
