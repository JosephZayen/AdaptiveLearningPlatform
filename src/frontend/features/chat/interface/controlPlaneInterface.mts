export interface ControlPlaneWidgetInterface {
    /*
    // DOM elements (first)
    newChatBtn: HTMLElement;
    newMessageFrameBtn: HTMLElement;
    reasoningSelectTag: HTMLElement;

    // dependency injection (second)
    setModelReasoning: (value: string) => void;
    addMsgFrame: (role: string, content: string) => void;
    highlightSidebarItem: () => void;
    appendSidebarItem: (chatId: number) => void;
    addEmptyChat: (chatId: number, systemMessage: unknown) => void;
    fetchNewChatId: () => Promise<number>;

    // internal state
    SYSTEM_MESSAGE_OBJECT: unknown;
    */
   
    // methods (second half)
    init(options): void;
    controlPlaneInit(): Promise<any>;
    addChat(): Promise<any>;
    
}