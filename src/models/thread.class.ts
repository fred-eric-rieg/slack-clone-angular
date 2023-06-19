import { Timestamp } from "@angular/fire/firestore";

export class Thread {
    threadId: string = '';
    messages: string[] = [];

    constructor(threadId: string, messages: string[]) {
        this.threadId = threadId;
        this.messages = messages;
    }

    public toJSON() {
        return {
            threadid: this.threadId,
            messages: this.messages
        };
    }
}