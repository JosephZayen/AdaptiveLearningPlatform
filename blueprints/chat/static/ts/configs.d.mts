import type { APIConfigsInterface, DataConfigsInterface, MacroConfigsInterface } from "./interface/configsInterface.mjs";
declare class APIConfigs implements APIConfigsInterface {
    todayStr: any;
    API_BASE_PATH: any;
    UPDATE_PATH: any;
    READSESSIONS_PATH: any;
    ASKAI_PATH: any;
    NEW_CHAT_PATH: any;
    modelReasoning: any;
    constructor();
    static dateToStr(today: any): string;
    setModelReasoning(r: any): void;
}
declare class DataConfigs implements DataConfigsInterface {
    SYSTEM_MESSAGE_OBJECT: any;
    constructor();
}
declare class MacroConfigs implements MacroConfigsInterface {
    FAILURE: any;
    SUCCESS: any;
    modelReasoning: any;
    constructor();
}
export declare const API: APIConfigs;
export declare const dataConfigs: DataConfigs;
export declare const macro: MacroConfigs;
export {};
//# sourceMappingURL=configs.d.mts.map