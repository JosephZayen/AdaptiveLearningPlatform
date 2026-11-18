import {Calendar} from "./calendar.mjs";
import {getData} from "./fetch.mjs"
import * as configs from "./configs.mjs"

const inputEvent = document.querySelector("#input-event");
const inputTime = document.querySelector("#input-time");
const inputBtn = document.querySelector("#button");
const tableBody = document.querySelector("#calendarBody");
const canvas = document.querySelector("#dayContent");

const prevMonthBtn = document.querySelector("#prevMonthBtn");
const nextMonthBtn = document.querySelector("#nextMonthBtn");

const calendar = new Calendar(tableBody, canvas, prevMonthBtn, nextMonthBtn);
calendar.renderTable();

nextMonthBtn.addEventListener("click", (ev)=>{
    calendar.next();
})

prevMonthBtn.addEventListener("click", (ev)=>{
    calendar.prev();
})

inputBtn.addEventListener("click", async (ev)=>{
    const description = inputEvent.value;
    const t = inputTime.value.trim();
    let h = null;
    let m = null;
    try{
        h = parseInt(t.split(":")[0]);
        m = parseInt(t.split(":")[1]);
    }catch(err){
        console.log(err);
        alert("input error");
        return;
    }
    const timestamp = new Date(calendar.now.getFullYear(), calendar.now.getMonth(), calendar.selected, h, m).getTime();
    const bd = {
        "timestamp": timestamp,
        "description": description
    }
    const url = configs.BASE_URL + `/api/add`;
    await getData(url, "POST", bd, "json");
    calendar.initCanvas();
})
