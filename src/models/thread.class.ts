export class Thread {
    threadId: string = '';
    messages: string[] = [];

    constructor(obj?: any) {
        this.threadId = obj && obj.threadId;
        this.messages = obj && obj.messages;
    }

    public toJSON() {
        return {
            threadId: this.threadId,
            messages: this.messages
        };
    }
}