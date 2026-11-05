export interface InputAreaInterface {
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
//# sourceMappingURL=inputAreaInterface.d.mts.map