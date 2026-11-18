import type {StoreInterface} from "./storeInterface.mjs";
import type {MessagesAreaInterface} from "./messagesInterface.mjs";
import type {APIConfigsInterface, MacroConfigsInterface, DataConfigsInterface} from "./configsInterface.mjs";
import type {NetworkInterface} from "./networkInterface.mjs";
import type {SidebarInterface} from "./sidebarInterface.mjs";
import type {ControlPlaneWidgetInterface} from "./controlPlaneInterface.mjs";

export interface Options {
    messagesArea: MessagesAreaInterface;
    API: APIConfigsInterface;
    macro: MacroConfigsInterface;
    dataConfigs:  DataConfigsInterface;
    store: StoreInterface;
    network: NetworkInterface;
    sidebar: SidebarInterface;
    controlPlane: ControlPlaneWidgetInterface;
    parseChats: any;
}

