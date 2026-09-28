import * as configs from "./configs.mjs";

export async function getData(url, method, body, type){
    /**
     * Params
     *  url: string
     *  method: "GET" | "POST" | OTHER
     *  body: object
     *  type: "json" | blob | other
     */
    const options = {
        method: String(method),
    };

    try {
        //parse the response based on the type
        if (type === "json"){
            if(String(method).includes("POST")){
                options.headers = {
                    "Content-Type": "application/json"
                }
                options.body = JSON.stringify(body);
            }   
            const resp = await fetch(url, options);
            if(!resp.ok){
                const errorText = await resp.text();
                console.error("Server response:", errorText);
                throw Error(`response Error: ${resp.status}`);
            }
            return await resp.json();
        } else if(type === "blob"){
            if(String(method).includes("POST")){
                options.headers = {
                    "Content-Type": "application/octet-stream"
                }
            }   
            const resp = await fetch(url, options);
            if(!resp.ok){
                const errorText = await resp.text();
                console.error("Server response:", errorText);
                throw Error(`response Error: ${resp.status}`);
            }
            return await resp.blob();
        } else if(type == "string"){
            if(String(method).includes("POST")){
                options.headers = {
                    "Content-Type": "application/json"
                }
            }   
            const resp = await fetch(url, options);
            if(!resp.ok){
                const errorText = await resp.text();
                console.error("Server response:", errorText);
                throw Error(`response Error: ${resp.status}`);
            }
            return await resp.text();
        }
        // other types defaults to json
        else{
            if(String(method).includes("POST")){
                options.headers = {
                    "Content-Type": "application/json"
                }
                options.body = JSON.stringify(body);
            }   
            const resp = await fetch(url, options);
            if(!resp.ok){
                const errorText = await resp.text();
                console.error("Server response:", errorText);
                throw Error(`response Error: ${resp.status}`);
            }
            return await resp.json();
        }
    } catch(err) {
        console.error(err);
        throw Error(`http error ${err}`);
    }
}