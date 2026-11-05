import type { ControlPlaneWidgetInterface } from "./interface/controlPlaneInterface.mjs";
export declare class ControlPlaneWidget implements ControlPlaneWidgetInterface {
    newChatBtn: HTMLElement;
    newMessageFrameBtn: HTMLElement;
    reasoningSelectTag: HTMLElement;
    setModelReasoning: (value: string) => void;
    addMsgFrame: (role: string, content: string) => void;
    highlightSidebarItem: () => void;
    appendSidebarItem: (chatId: number) => void;
    addEmptyChat: (chatId: number, systemMessage: unknown) => void;
    fetchNewChatId: () => Promise<number>;
    setActiveChatId: Function;
    renderChat: Function;
    SYSTEM_MESSAGE_OBJECT: any;
    constructor(options: any);
    init(options: any): void;
    controlPlaneInit(): Promise<unknown>;
    addChat(): Promise<void>;
}
//# sourceMappingURL=controlPlaneWidget.d.mts.map