import type { Options } from "./interface/optionsInterface.mjs";
export declare class InputAreaWidget {
    inputBtn: HTMLElement;
    textArea: HTMLTextAreaElement;
    addMsgFrame: (role: string, text: string) => void;
    renderChat: () => void;
    askai: any;
    store: Options["store"];
    API: Options["API"];
    constructor(options: any);
    init(options: Options): void;
    /**
     * 我可以用数组来反映消息的状态，也可以用对象，前者好处就是直接添加容易，缺点是删除复杂，因为删除了一个消息岂不是说其它的要重新赋值ID？序列变了，这样耦合程度太高。如果是集合，删除容易，添加麻烦，因为不知道最大的序列，所以还需要一个对象来保存
     *
     *
     * AI的解决办法是直接用一个数组来存顺序，确实，因为每次我重新排其实就是在算这个列表，从小到大，那直接维护就好了，每次重新渲染时间复杂度只需要O(n)，如果是我之前那个即时算的办法就是O(nlog(n))
     */
    inputAreaInit(): Promise<void>;
    inputHandler(): void;
    getRenderResponse(): Promise<void>;
}
//# sourceMappingURL=inputWidget.d.mts.map