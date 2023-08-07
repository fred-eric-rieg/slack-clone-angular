import { Timestamp } from "@angular/fire/firestore";

export class Thread {
    threadId: string = '';
    messages: string[] = [];
    creationDate: Timestamp = Timestamp.now();

    constructor(obj?: any) {
        this.threadId = obj && obj.threadId || '';
        this.messages = obj && obj.messages || [];
        this.creationDate = obj && obj.creationDate || Timestamp.now();
    }

    public toJSON() {
        return {
            threadId: this.threadId,
            messages: this.messages,
            creationDate: this.creationDate
        };
    }
}