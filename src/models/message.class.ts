import { Timestamp } from "@angular/fire/firestore";

export class Message {
    messageId: string = '';
    creatorId: string = '';
    creationDate: Timestamp;
    text: string = '';

    constructor(obj?: any) {
        this.messageId = obj && obj.messageId || '';
        this.creatorId = obj && obj.creatorId || '';
        this.creationDate = obj && new Timestamp(obj.creationDate.seconds, obj.creationDate.nanoseconds) || Timestamp.now();
        this.text = obj && obj.text || '';
    }


    toJSON() {
        return {
            messageId: this.messageId,
            creatorId: this.creatorId,
            creationDate: this.creationDate,
            text: this.text
        }
    }
}