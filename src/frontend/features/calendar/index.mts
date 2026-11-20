import {Calendar} from "./calendar.mjs";
import {getData} from "./fetch.mjs"
import * as configs from "./configs.mjs"

const inputEvent = document.querySelector("#input-event") as HTMLInputElement;
const inputTime = document.querySelector("#input-time") as HTMLInputElement;
const inputBtn = document.querySelector("#button") as HTMLElement;
const tableBody = document.querySelector("#calendarBody") as HTMLElement;
const canvas = document.querySelector("#dayContent") as HTMLElement;

const prevMonthBtn = document.querySelector("#prevMonthBtn") as HTMLElement;
const nextMonthBtn = document.querySelector("#nextMonthBtn") as HTMLElement;

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
    let h: number | null = null;
    let m: number | null = null;
    try{
        const parts: string[] = t.split(":");
        if(parts[0] && parts[1]){
            h = parseInt(parts[0]);
            m = parseInt(parts[1]);
        }
        if(!(typeof h === "number" && typeof m === "number")){
            throw new Error("input event listener error, parse failed")
        }
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
