import type { ControlPlaneWidgetInterface } from "./interface/controlPlaneInterface.mjs";
import type { Options } from "./interface/optionsInterface.mjs";
export declare class ControlPlaneWidget implements ControlPlaneWidgetInterface {
    newChatBtn: HTMLElement;
    newMessageFrameBtn: HTMLElement;
    reasoningSelectTag: HTMLElement;
    setModelReasoning: (value: string) => void;
    addMsgFrame: (role: string, content: string) => void;
    highlightSidebarItem: () => void;
    appendSidebarItem: (chatId: number) => void;
    addEmptyChat: any;
    fetchNewChatId: () => Promise<number>;
    setActiveChatId: Function;
    renderChat: Function;
    SYSTEM_MESSAGE_OBJECT: any;
    constructor(options: any);
    init(options: Options): void;
    controlPlaneInit(): Promise<unknown>;
    addChat(): Promise<void>;
}
//# sourceMappingURL=controlPlaneWidget.d.mts.map