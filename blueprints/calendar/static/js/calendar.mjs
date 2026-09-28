
import {showNotification} from "./notification.mjs";
import {getData} from "./fetch.mjs";
import * as configs from "./configs.mjs";

export class Calendar{
    constructor(table, canvas, prevMonth, nextMonth){
        const today = new Date();
        const now = new Date(today.getFullYear(), today.getMonth(), 1);
        this.table = table;
        this.canvas = canvas;
        this.prevMonth = prevMonth;
        this.nextMonth = nextMonth;
        this.now = now;
        this.maxDays = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate();
        this.selected = now.getDate();
        this.mapping = {
            0: 7,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6
        }
        this.table.addEventListener("click", (ev) => this.handler(ev));
        this.initCanvas();
    }

    handler(ev){
        if(ev.target.closest("td")){
            const el = ev.target.closest("td");
            if (el?.textContent) {            
                this.select(el.textContent ? el.textContent : "");
                this.renderTable(); 
                this.initCanvas();
            }
        }
    }

    static fillTableRow(stream){
        let tb = "";
        let idx = 0;
        for(; idx <= stream.length - 1; idx++){
            tb += `<td>${stream[idx]}</td>`
        }
        tb = `<tr>${tb}</tr>`;
        return tb;
    }

    renderTable(){
        // get monday -> 1, mapping like this
        const dayOfWeek = this.mapping[this.now.getDay()];
        const maxDays = this.maxDays;
        const dayStream = Array.from({"length": maxDays}, (_, i) => i + 1);
        let trs = "";

        const firstDay = this.mapping[new Date(this.now.getFullYear(), this.now.getMonth(), 1).getDay()];
        let i = 1 + (7 - firstDay) + 1 - 1; // now i without - 1 corresponds to the first Monday after the first Sunday this Month, its date, but for the index it's i
        const padStart = "<td></td>".repeat(firstDay - 1);
        const text = Array.from({"length": 7 - firstDay + 1}, (_, idx) => `<td>${idx + 1}</td>`).join("");
        trs += `<tr>${padStart + text}</tr>`;
        
        i += 7;
        for(; i <= maxDays - 1; i += 7){
            trs += Calendar.fillTableRow(dayStream.slice(i - 7, i));
        }

        i -= 7;
        //calculate what day is the last day
        const lastDayOfWeek = this.mapping[new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDay()];
        let tds = "";
        for (const tdContent of dayStream.slice(i, dayStream.length)){
            tds += `<td>${tdContent}</td>`;
        }
        trs += `<tr>${tds + "<td></td>".repeat(7 - lastDayOfWeek)}</tr>`;
        this.table.innerHTML = trs;
        //fill td ids with their day number
        for(let trIndex = 0; trIndex < this.table.children.length; trIndex++){
            const trChild = this.table.children[trIndex];
            for(let idx = 0; idx < trChild.children.length; idx++){
                const child = trChild.children[idx];
                const childId = child.textContent.trim() ? child.textContent.trim() : null;
                if (childId != null){
                    child.id = "td-" + String(childId);
                }
                if(childId != null && parseInt(childId) === parseInt(this.selected)){
                    child.style.backgroundColor = "cyan";
                }
            }
        }
    }

    select(day){
        if (day){
            this.selected = parseInt(day);
        }
    }

    fetchEvents(){
        const params = new URLSearchParams({
            "local_date": [this.now.getFullYear(), this.now.getMonth() + 1, this.selected].join("-")
        })
        console.log("fetch events: ", [this.now.getFullYear(), this.now.getMonth() + 1, this.selected].join("-"));
        const url = `${configs.BASE_URL}/api/search?${params}`;
        return getData(url, "GET", null, "json");

    }

    async initCanvas(){
        this.canvas.innerHTML = "";
        const evs = await this.fetchEvents();
        console.log(evs);
        for(let ev of evs){
            //guaranteed structure
            const description = String(ev["description"]);
            const id = parseInt(ev["id"]);
            const timestamp = parseInt(ev["timestamp"]);
            showNotification(`event id: ${id}`, {
                "body": description,
                "timestamp": timestamp,
                "tag": String(id)
            });
            //render event
            const board = this.canvas;
            if(board){
                const span = document.createElement("span");
                const date = new Date(timestamp);
                const h = date.getHours();
                const m = date.getMinutes();
                span.textContent = `${h}:${m} ${description}`;
                board.appendChild(span);
            }
        }
    }

    monthShift(mode){
        if(mode === "next"){
            this.now.setMonth(this.now.getMonth() + 1);
        }else if(mode === "prev"){
            this.now.setMonth(this.now.getMonth() - 1);
        }else{
            throw new Error("Calendar internal function call error: monthShift");
        }
        this.maxDays = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate();
        if(this.maxDays < this.selected){
            this.selected = this.maxDays;
        }
        this.renderTable();
        this.initCanvas();
    }
    prev(){
        this.monthShift("prev");
    }
    next(){
        this.monthShift("next");
    }

}