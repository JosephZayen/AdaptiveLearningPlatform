export interface InputAreaInterface {
    /*
    // ===== DOM 相关属性（最前面）=====
    inputBtn: HTMLElement;
    textArea: HTMLTextAreaElement;

    // ===== 依赖注入属性（第二部分）=====
    addMsgFrame: (role: string, text: string) => void;
    renderChat: () => void;
    askai;
    */

    // methods
    init(options: {
        messagesAreaWidget: {
            addMsgFrame: (role: string, text: string) => void;
            renderChat: () => void;
        };
    }): void;
    inputAreaInit(): Promise<void>;
    inputHandler(): void;
    getRenderResponse(): Promise<void>;
}