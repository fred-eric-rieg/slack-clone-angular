import { Timestamp } from "@angular/fire/firestore";

export class Thread {
    threadId: string = '';
    messages: string[] = [];
    creationDate: Timestamp;

    constructor(obj?: any) {
        this.threadId = obj && obj.threadId || '';
        this.messages = obj && obj.messages || [];
        this.creationDate = obj && new Timestamp(obj.creationDate.seconds, obj.creationDate.nanoseconds) || Timestamp.now();
    }

    public toJSON() {
        return {
            threadId: this.threadId,
            messages: this.messages,
            creationDate: this.creationDate
        };
    }
}